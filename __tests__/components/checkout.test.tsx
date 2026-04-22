import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "@/app/checkout/page";

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockItems = [
  {
    product: {
      id: "1",
      name: "Classic White Tee",
      price: 29,
      image: "https://example.com/tee.jpg",
      category: "Men",
      images: [],
      description: "A tee",
      sizes: ["M"],
      colors: ["White"],
      rating: 4.8,
      reviews: 124,
    },
    quantity: 2,
    size: "M",
    color: "White",
  },
];

// Prefixed "mock" so jest.mock factory is allowed to reference it
let mockCartData = {
  items: mockItems,
  total: () => 58,
  clearCart: jest.fn(),
};

jest.mock("@/lib/store", () => ({
  useCartStore: () => mockCartData,
}));

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
  await user.type(screen.getByPlaceholderText("10-digit mobile number"), "9876543210");
  await user.type(screen.getByPlaceholderText("First name"), "John");
  await user.type(screen.getByPlaceholderText("Last name"), "Doe");
  await user.type(screen.getByPlaceholderText("Address"), "123 Main St");
  await user.type(screen.getByPlaceholderText("City"), "Mumbai");
  await user.type(screen.getByPlaceholderText("PIN code"), "400001");
  await user.click(screen.getByRole("button", { name: /pay/i }));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.resetAllMocks();
  localStorageMock.clear();
  global.fetch = jest.fn();
  window.location.href = "";
  mockCartData = { items: mockItems, total: () => 58, clearCart: jest.fn() };
});

describe("CheckoutPage", () => {
  describe("rendering", () => {
    it("renders all required form fields", () => {
      render(<CheckoutPage />);
      expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("10-digit mobile number")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("PIN code")).toBeInTheDocument();
    });

    it("renders the order summary with cart items", () => {
      render(<CheckoutPage />);
      expect(screen.getByText("Classic White Tee")).toBeInTheDocument();
      expect(screen.getByText("Order Summary")).toBeInTheDocument();
    });

    it("shows empty cart state when cart has no items", () => {
      mockCartData = { items: [], total: () => 0, clearCart: jest.fn() };
      render(<CheckoutPage />);
      expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
    });

    it("disables the pay button when required fields are empty", () => {
      render(<CheckoutPage />);
      const button = screen.getByRole("button", { name: /pay/i });
      expect(button).toBeDisabled();
    });

    it("enables the pay button when all required fields are filled", async () => {
      render(<CheckoutPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
      await user.type(screen.getByPlaceholderText("10-digit mobile number"), "9876543210");
      await user.type(screen.getByPlaceholderText("First name"), "John");
      await user.type(screen.getByPlaceholderText("Last name"), "Doe");
      await user.type(screen.getByPlaceholderText("Address"), "123 Main St");
      await user.type(screen.getByPlaceholderText("City"), "Mumbai");
      await user.type(screen.getByPlaceholderText("PIN code"), "400001");

      expect(screen.getByRole("button", { name: /pay/i })).not.toBeDisabled();
    });
  });

  describe("successful payment flow", () => {
    const MOCK_RESPONSE = {
      orderId: "DRPTEST01",
      customerId: "testexamplecom",
      paymentUrl: "https://sandbox.juspay.in/orders/ordeh_test/payment-page",
      amount: 63.64,
    };

    it("calls /api/create-order and redirects to paymentUrl on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 })
      );

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/create-order",
          expect.objectContaining({ method: "POST" })
        );
      });

      await waitFor(() => {
        expect(window.location.href).toBe(MOCK_RESPONSE.paymentUrl);
      });
    });

    it("stores customerId in localStorage keyed by orderId before redirect", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 })
      );

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        expect(localStorageMock.getItem("juspay_cid_DRPTEST01")).toBe(
          "testexamplecom"
        );
      });
    });

    it("sends correct items and customer payload to /api/create-order", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(MOCK_RESPONSE), { status: 200 })
      );

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        const [, options] = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(options.body);
        expect(body.items).toEqual([
          { productId: "1", quantity: 2, size: "M", color: "White" },
        ]);
        expect(body.customer.email).toBe("test@example.com");
        expect(body.customer.phone).toBe("9876543210");
        expect(body.customer.firstName).toBe("John");
      });
    });
  });

  describe("error handling", () => {
    it("shows gateway error message and does not redirect on 502", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "Payment gateway error. Please try again." }),
          { status: 502 }
        )
      );

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        expect(screen.getByText(/payment gateway error/i)).toBeInTheDocument();
      });
      expect(window.location.href).toBe("");
    });

    it("shows network error message on fetch failure", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new TypeError("Failed to fetch")
      );

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
      expect(window.location.href).toBe("");
    });

    it("re-enables the button after an error so user can retry", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Boom"));

      render(<CheckoutPage />);
      await fillAndSubmit(userEvent.setup());

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: /pay/i })).not.toBeDisabled();
    });
  });
});

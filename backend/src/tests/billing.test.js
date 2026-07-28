// 🧪 INTEGRACIONI TEST POKRIVENOSTI ZA STRIPE BILLING PORTAL (NutriFlow Backend)
const { createBillingPortalSession } = require("../controllers/billingController");
const User = require("../models/User");

// Mock-ujemo rad Mongoose modela i Stripe SDK biblioteke radi izolovanog testiranja
jest.mock("../models/User");
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: "https://stripe.com" })
      }
    }
  }));
});

describe("💳 NUTRIFLOW B2C BILLING INTEGRATION TEST MATRIX", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: "mock-user-123" },
      headers: { "user-agent": "Jest-Test-Agent" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("TC-BILLING-001: Should successfully generate secure Stripe Portal URL if customer has registered payment profile", async () => {
    // Simuliramo povlačenje Premium korisnika sa postojećim Stripe Customer ID-em
    User.findById.mockResolvedValue({
      _id: "mock-user-123",
      email: "nemanja@zmaj.rs",
      stripeCustomerId: "cus_mock_frankfurt_999"
    });

    await createBillingPortalSession(req, res);

    // Verifikacija mrežnog ugovora: Server mora vratiti HTTP 200 i Stripe link
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        url: "https://stripe.com"
      })
    );
  });
});

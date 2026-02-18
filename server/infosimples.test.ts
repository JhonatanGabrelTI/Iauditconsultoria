import { describe, expect, it } from "vitest";
import { isInfoSimplesConfigured } from "./infosimples";

describe("InfoSimples API Configuration", () => {
  it("should have InfoSimples API token configured", () => {
    const isConfigured = isInfoSimplesConfigured();
    expect(isConfigured).toBe(true);
  });

  it("should have valid token format", () => {
    const token = process.env.INFOSIMPLES_API_TOKEN;
    expect(token).toBeDefined();
    expect(token).toContain("sntc-");
  });
});

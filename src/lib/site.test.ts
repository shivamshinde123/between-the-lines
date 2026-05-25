import { describe, expect, it } from "vitest";
import { hasUniqueRoutes, plannedRoutes, stageMilestones } from "./site";

describe("site planning data", () => {
  it("keeps route hrefs unique", () => {
    expect(hasUniqueRoutes()).toBe(true);
  });

  it("includes the core product surfaces", () => {
    expect(plannedRoutes.map((route) => route.href)).toEqual(
      expect.arrayContaining(["/", "/login", "/signup", "/books/sample-book", "/insights"]),
    );
  });

  it("documents bootstrap milestones", () => {
    expect(stageMilestones).toHaveLength(4);
  });
});

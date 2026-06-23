const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { projectRoot } = require("../setup/ts-register.cjs");

const userQueryPath = path.join(projectRoot, "lib", "queries", "user.ts");
let currentProfile = null;

require.cache[userQueryPath] = {
  id: userQueryPath,
  filename: userQueryPath,
  loaded: true,
  exports: {
    getCurrentUserProfile: async () => currentProfile,
  },
};

const { requireAnyRole, requireAuthenticatedUser, requireRole } = require("../../lib/auth/guards.ts");

const officeProfile = {
  id: "office-1",
  name: "Office User",
  email: "office@dlsl.edu.ph",
  role: "office",
  office_name: "CIO",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

test("requireAuthenticatedUser rejects anonymous users", async () => {
  currentProfile = null;

  assert.deepEqual(await requireAuthenticatedUser(), {
    ok: false,
    error: "Unauthorized",
  });
});

test("requireRole allows matching roles", async () => {
  currentProfile = officeProfile;

  assert.deepEqual(await requireRole("office"), {
    ok: true,
    profile: officeProfile,
  });
});

test("requireAnyRole rejects non-matching roles", async () => {
  currentProfile = officeProfile;

  assert.deepEqual(await requireAnyRole(["admin", "stakeholder"]), {
    ok: false,
    error: "Unauthorized",
  });
});

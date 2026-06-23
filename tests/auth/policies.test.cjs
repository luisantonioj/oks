const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { projectRoot } = require("../setup/ts-register.cjs");

const supabaseServerPath = path.join(projectRoot, "lib", "supabase", "server.ts");
let recordOwnerId = "office-1";
let queryError = null;

function createPolicyClient() {
  return {
    from() {
      return {
        select(columns) {
          assert.equal(columns, "office_id");
          return {
            eq(column, id) {
              assert.equal(column, "id");
              assert.ok(id);
              return {
                async single() {
                  if (queryError) {
                    return { data: null, error: queryError };
                  }

                  return {
                    data: { office_id: recordOwnerId },
                    error: null,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

require.cache[supabaseServerPath] = {
  id: supabaseServerPath,
  filename: supabaseServerPath,
  loaded: true,
  exports: {
    createClient: async () => createPolicyClient(),
  },
};

const { assertCanManageAnnouncement, assertCanManageSurvey } = require("../../lib/auth/policies.ts");

const adminProfile = {
  id: "admin-1",
  name: "Admin",
  email: "admin@dlsl.edu.ph",
  role: "admin",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const officeProfile = {
  id: "office-1",
  name: "Office",
  email: "office@dlsl.edu.ph",
  role: "office",
  office_name: "CIO",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const stakeholderProfile = {
  id: "stakeholder-1",
  name: "Stakeholder",
  email: "student@dlsl.edu.ph",
  role: "stakeholder",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

test("admin can manage announcement without ownership lookup", async () => {
  queryError = new Error("should not be queried");

  assert.deepEqual(await assertCanManageAnnouncement(adminProfile, "announcement-1"), { ok: true });
});

test("office can manage owned survey", async () => {
  queryError = null;
  recordOwnerId = "office-1";

  assert.deepEqual(await assertCanManageSurvey(officeProfile, "survey-1"), { ok: true });
});

test("office cannot manage records owned by another office", async () => {
  queryError = null;
  recordOwnerId = "office-2";

  assert.deepEqual(await assertCanManageAnnouncement(officeProfile, "announcement-1"), {
    ok: false,
    error: "Unauthorized: You do not own this announcement",
  });
});

test("stakeholders cannot manage office-owned records", async () => {
  assert.deepEqual(await assertCanManageSurvey(stakeholderProfile, "survey-1"), {
    ok: false,
    error: "Unauthorized",
  });
});

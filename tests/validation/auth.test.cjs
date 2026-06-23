require("../setup/ts-register.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createOfficeInputFromFormData,
  signInInputFromFormData,
  stakeholderSignupInputFromFormData,
} = require("../../lib/validation/auth.ts");
const { isDlslEmail, normalizeEmail } = require("../../lib/validation/email.ts");

function formData(entries) {
  const data = new FormData();

  for (const [key, value] of entries) {
    data.set(key, value);
  }

  return data;
}

test("normalizes email addresses before auth submission", () => {
  assert.equal(normalizeEmail("  USER@DLSL.EDU.PH "), "user@dlsl.edu.ph");

  const input = signInInputFromFormData(
    formData([
      ["email", "  USER@DLSL.EDU.PH "],
      ["password", "secret"],
    ]),
  );

  assert.deepEqual(input, {
    email: "user@dlsl.edu.ph",
    password: "secret",
  });
});

test("accepts only strict DLSL stakeholder signup emails", () => {
  assert.equal(isDlslEmail("student@dlsl.edu.ph"), true);
  assert.equal(isDlslEmail("student@not-dlsl.edu.ph"), false);
  assert.equal(isDlslEmail("student+dlsl@gmail.com"), false);
});

test("parses stakeholder signup optional fields", () => {
  const input = stakeholderSignupInputFromFormData(
    formData([
      ["email", "student@dlsl.edu.ph"],
      ["password", "password123"],
      ["name", "Student User"],
      ["age", "21"],
      ["community", "college"],
      ["contact", "09123456789"],
      ["permanent_address", "Permanent Address"],
      ["current_address", "Current Address"],
    ]),
  );

  assert.equal(input.age, 21);
  assert.equal(input.permanentAddress, "Permanent Address");
  assert.equal(input.currentAddress, "Current Address");
});

test("validates office creation inputs", () => {
  const input = createOfficeInputFromFormData(
    formData([
      ["email", "OFFICE@DLSL.EDU.PH"],
      ["password", "password123"],
      ["name", "Office User"],
      ["office_name", "CIO"],
      ["age", "35"],
      ["gender", "Female"],
      ["contact", "09123456789"],
    ]),
  );

  assert.equal(input.email, "office@dlsl.edu.ph");
  assert.equal(input.officeName, "CIO");
  assert.equal(input.age, 35);
});

test("rejects short passwords", () => {
  assert.throws(
    () =>
      createOfficeInputFromFormData(
        formData([
          ["email", "office@dlsl.edu.ph"],
          ["password", "12345"],
          ["name", "Office User"],
          ["office_name", "CIO"],
        ]),
      ),
    /Password must be at least 6 characters/,
  );
});

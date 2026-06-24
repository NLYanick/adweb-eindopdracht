import {
  getUser,
  createUser,
  getUsersByEmail,
} from "../../app/services/user-service";

jest.mock("../../app/lib/firebase", () => ({ db: {} }));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => "collection-ref"),
  doc:        jest.fn(() => "doc-ref"),
  getDoc:     jest.fn(),
  getDocs:    jest.fn(),
  setDoc:     jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(),
  query:      jest.fn(() => "query-ref"),
  where:      jest.fn(() => "where-clause"),
}));

import { getDoc, getDocs, setDoc, doc } from "firebase/firestore";

beforeEach(() => jest.clearAllMocks());

describe("getUser", () => {
  it("returns null when uid is empty", async () => {
    const result = await getUser("");
    expect(result).toBeNull();
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("returns user when doc exists", async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: "user-1", email: "alice@test.com", name: "Alice" }),
    });

    const result = await getUser("user-1");
    expect(result).toEqual({ uid: "user-1", email: "alice@test.com", name: "Alice" });
  });

  it("returns null when doc does not exist", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    const result = await getUser("user-1");
    expect(result).toBeNull();
  });
});

describe("createUser", () => {
  it("calls setDoc with correct user data", async () => {
    await createUser({ uid: "user-1", email: "alice@test.com", name: "Alice" });
    expect(setDoc).toHaveBeenCalledWith(
      "doc-ref",
      { uid: "user-1", email: "alice@test.com", name: "Alice" }
    );
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "user-1");
  });

  it("returns null on error", async () => {
    setDoc.mockRejectedValue(new Error("Firebase error"));
    const result = await createUser({ uid: "user-1", email: "alice@test.com", name: "Alice" });
    expect(result).toBeNull();
  });
});

describe("getUsersByEmail", () => {
  it("returns null when email is empty", async () => {
    const result = await getUsersByEmail("", "user-1");
    expect(result).toBeNull();
    expect(getDocs).not.toHaveBeenCalled();
  });

  it("returns matching users", async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ uid: "user-2", email: "bob@test.com", name: "Bob" }) },
        { data: () => ({ uid: "user-3", email: "bobby@test.com", name: "Bobby" }) },
      ],
    });

    const result = await getUsersByEmail("bob", "user-1");
    expect(result).toHaveLength(2);
    expect(result[0].email).toBe("bob@test.com");
  });

  it("excludes the current user from results", async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ uid: "user-1", email: "alice@test.com", name: "Alice" }) },
        { data: () => ({ uid: "user-2", email: "alice2@test.com", name: "Alice2" }) },
      ],
    });

    const result = await getUsersByEmail("alice", "user-1");
    expect(result).toHaveLength(1);
    expect(result[0].uid).toBe("user-2");
  });

  it("returns null when no users found", async () => {
    getDocs.mockResolvedValue({ empty: true, docs: [] });
    const result = await getUsersByEmail("nobody", "user-1");
    expect(result).toBeNull();
  });

  it("respects the limit parameter", async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ uid: "user-2", email: "a@test.com", name: "A" }) },
        { data: () => ({ uid: "user-3", email: "b@test.com", name: "B" }) },
        { data: () => ({ uid: "user-4", email: "c@test.com", name: "C" }) },
      ],
    });

    const result = await getUsersByEmail("test", "user-1", 2);
    expect(result).toHaveLength(2);
  });

  it("clamps limit to 1 when below 1", async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => ({ uid: "user-2", email: "a@test.com", name: "A" }) }],
    });

    const result = await getUsersByEmail("test", "user-1", 0);
    expect(result).toHaveLength(1);
  });

  it("clamps limit to MAX_SUGGESTIONS (25) when above", async () => {
    const manyUsers = Array.from({ length: 30 }, (_, i) => ({
      data: () => ({ uid: `user-${i + 2}`, email: `user${i}@test.com`, name: `User ${i}` }),
    }));
    getDocs.mockResolvedValue({ empty: false, docs: manyUsers });

    const result = await getUsersByEmail("test", "user-1", 30);
    expect(result).toHaveLength(25);
  });
});

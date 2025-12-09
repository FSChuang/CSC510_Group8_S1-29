import { submitReview } from "./reviews";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true })
  })
);

test("submitReview sends POST request", async () => {
  await submitReview(5, {
    userName: "Kunj",
    rating: 4,
    comment: "Nice"
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1].method).toBe("POST");
});

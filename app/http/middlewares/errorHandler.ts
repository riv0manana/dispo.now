import { Context } from "hono";

const isProd = Deno.env.get("NODE_ENV") === "production";

export const errorHandler = (err: Error, c: Context) => {
  const knownErrors = [
    "CapacityExceeded",
    "ResourceNotFound",
    "BookingNotFound",
    "ResourceDoesNotBelongToProject",
    "BookingDoesNotBelongToProject",
    "InvalidTimeRange",
    "BookingAlreadyCancelled",
    "DayNotAllowed",
    "StartTimeOutsideConfig",
    "EndTimeOutsideConfig",
    "BookingSpansClosedHours",
  ];

  if (!knownErrors.includes(err.message)) {
    console.error(err);
  }

  if (err.message === "CapacityExceeded") {
    return c.json({ error: "CapacityExceeded" }, 409);
  }

  if (err.message === "ResourceNotFound" || err.message === "BookingNotFound") {
    return c.json({ error: "NotFound" }, 404);
  }

  if (
    err.message === "ResourceDoesNotBelongToProject" ||
    err.message === "BookingDoesNotBelongToProject"
  ) {
    return c.json({ error: "Forbidden" }, 403);
  }

  if (
    err.message === "InvalidTimeRange" ||
    err.message === "BookingAlreadyCancelled" ||
    err.message === "DayNotAllowed" ||
    err.message === "StartTimeOutsideConfig" ||
    err.message === "EndTimeOutsideConfig" ||
    err.message === "BookingSpansClosedHours"
  ) {
    return c.json({ error: err.message }, 400);
  }

  // Handle Deno/Zod OpenApi Registry Error specifically
  if (err instanceof TypeError && err.message.includes("reading 'parent'")) {
    return c.json(
      {
        error: "OpenAPI Generation Error",
        message:
          "Deno/Zod compatibility issue. The API works, but Swagger UI is unavailable in this environment.",
      },
      500,
    );
  }

  if (err instanceof Error && "issues" in err) {
    return c.json(
      { error: "ValidationError", issues: (err as any).issues },
      400,
    );
  }

  if (isProd) {
    return c.json({ error: "InternalServerError" }, 500);
  }

  return c.json({ error: "InternalServerError", message: err.message }, 500);
};

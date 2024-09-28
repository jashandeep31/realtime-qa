import { db } from "@repo/db";
import { ApplicationError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import { createClassValidator } from "../validators/class.validator.js";

const createClass = catchAsync(async (req, res, next) => {
  const preData = req.body;
  // const userId = req?.user?.id as any;
  // if (!userId) return next(new ApplicationError("Unauthorized", 401));
  const parsedData = createClassValidator.safeParse(preData);
  if (parsedData.error) {
    throw new ApplicationError("Invalid data", 400);
  }
  const finalData = parsedData.data;
  const newClass = await db.liveClass.create({
    data: {
      name: finalData.name,
      description: finalData.description,
      userId: "vgsdf",
    },
  });
});

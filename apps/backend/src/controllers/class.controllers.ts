import { db } from "@repo/db";
import { ApplicationError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import { createClassValidator } from "../validators/class.validator.js";

export const createClass = catchAsync(async (req, res, next) => {
  const preData = req.body;
  const user = req.user;
  // const userId = req?.user?.id as any;
  if (!user) return next(new ApplicationError("Unauthorized", 401));
  const parsedData = createClassValidator.safeParse(preData);
  if (parsedData.error) {
    throw new ApplicationError("Invalid data", 400);
  }
  const finalData = parsedData.data;
  const newClass = await db.liveClass.create({
    data: {
      name: finalData.name,
      description: finalData.description,
      userId: user.id,
    },
  });

  return res.status(201).json({ data: newClass });
});

export const getAllLiveClasses = catchAsync(async (req, res) => {
  const classes = await db.liveClass.findMany({
    where: {
      expired: false,
    },
  });
  return res.status(200).json({ classes });
});

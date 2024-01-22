import { Router, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../types/types";
import authenticateToken from "../utils/authenticateToken";

const userRouter = Router();
const thirtyMinutes = 30 * 60 * 1000; // ms

userRouter.post("/register", async (req: Request, res: Response) => {

  try {
    const { email, password, firstName, lastName, phoneNumber, country, town, postalCode, streetName, houseNumber } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      country,
      town,
      postalCode,
      streetName,
      houseNumber
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      town: user.town,
      postalCode: user.postalCode,
      streetName: user.streetName,
      houseNumber: user.houseNumber
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.dataValues.password || ""
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, {
      expiresIn: thirtyMinutes,
    });

    res.cookie('token', token, {
      httpOnly: true
    });

    res.status(200).send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

userRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const userToDelete = await User.findByPk(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.destroy({ where: { id: userId } });

    res.status(204).send(); // 204 No Content indicates a successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

userRouter.patch('/:id', (req, res) => {
  const { firstName, lastName, phoneNumber, country, town, postalCode, streetName, houseNumber } = req.body;
  User.update({
    firstName, lastName, phoneNumber, country, town, postalCode, streetName, houseNumber
  },
    {
      where: {
        id: req.params.id
      }
    }).then((article) => {
      res.status(201).json(article);
    }).catch(err => {
      res.status(400).json(`Can't update article - ${err.message}`)
    })
})

userRouter.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    const userId = (req as any as RequestWithUser).user.id;
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).json({
        id: user.dataValues.id,
        email: user.dataValues.email,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        phoneNumber: user.dataValues.phoneNumber,
        country: user.dataValues.country,
        town: user.dataValues.town,
        postalCode: user.dataValues.postalCode,
        streetName: user.dataValues.streetName,
        houseNumber: user.dataValues.houseNumber
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

export default userRouter;

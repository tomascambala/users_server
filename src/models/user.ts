import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/database";

interface UserAttribute {
  id: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  town?: string;
  postalCode?: string;
  streetName?: string;
  houseNumber?: string;
}

interface UserCreationAttribute extends Optional<UserAttribute, "id"> { }

class User extends Model<UserAttribute, UserCreationAttribute> {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phoneNumber!: string;
  public country!: string;
  public town!: string;
  public postalCode!: string;
  public streetName!: string;
  public houseNumber!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isStrongPassword(value: string) {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g.test(value)) {
            throw new Error('Password is not strong enough');
          }
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCaseSensitivePhoneNumber(value: string) {
          if (!/^\d{10}$/g.test(value)) {
            throw new Error('Invalid phone number format');
          }
        },
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    town: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "users",
    sequelize,
    timestamps: true,
    paranoid: true,
  }
);

export default User;

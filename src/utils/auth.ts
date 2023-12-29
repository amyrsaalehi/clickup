import Cookies from "js-cookie";
import crypto from "crypto";

export const generateHashCode = ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(`${fullName}${email}${password}`, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return hash;
};

export const logout = () => {
  Cookies.remove("token");
};

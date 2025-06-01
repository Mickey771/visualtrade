import { setAuth, setUser } from "@/redux/reducers/userReducer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch } from "react-redux";

// Define types for form data
interface LoginFormData {
  email: string;
  password: string;
}

// Define types for API response
interface LoginApiResponse {
  success: boolean;
  data?: {
    message?: string;
    user?: any;
  };
  message?: string;
}

const LoginDetails: React.FC = () => {
  // State for form fields with typed initial values
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // State for form submission status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isResetRequest, setIsResetRequest] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // Handle input changes with proper typing
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission with proper typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form data
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      // Use Next.js 14 API route instead of direct call to external API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // Include credentials to ensure cookies are saved
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.data?.message || "Login failed");
      }

      setSuccess("Login successful!");

      // Handle successful login - we don't need to manually set cookies
      // as the API route already handled that with HTTP-only cookies
      if (data.success) {
        // Update Redux state
        dispatch(setAuth(true));
        dispatch(setUser(data.data));

        // Redirect user to dashboard
        router.push("/trade");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-full min-h-lvh flex">
      <div className="zr:hidden md:flex relative w-full h-full max-w-[50%]">
        <Image
          src={"/register.png"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%" }}
          alt="register"
          className="object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000061]"></div>
      </div>

      <div className="p-10 bg-[hsl(222,65%,8%)] w-full">
        <div className="flex justify-between w-full">
          <Link href={"/"}>
            <div className="w-full h-fit max-w-[200px]">
              <Image
                src={"/logo.png"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "100%" }}
                alt="register"
              />
            </div>
          </Link>
        </div>

        <h2 className="text-[2rem] mt-20 font-bold text-white">Welcome Back</h2>
        <p className="text-[1rem] mt-5 text-white">
          We missed you and are excited to have you here again
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 text-white flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="px-[24px] py-[14px] bg-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.2)] rounded-[8px] h-fit"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password">Password</label>
            <div className=" pr-4 flex gap-2 items-center bg-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.2)] rounded-[8px] h-fit">
              <input
                type={`${isPasswordVisible ? "text" : "password"}`}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="px-[24px] py-[14px] focus:outline-none bg-transparent w-full"
              />
              <button
                className=""
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? (
                  <span>
                    <BsEye size={23} />
                  </span>
                ) : (
                  <span>
                    <BsEyeSlash size={23} />
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setIsResetRequest(true)}>
              <span className="text-base hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </button>
          </div>

          {isResetRequest && (
            <p className="text-[1rem] mt-5 text-white">
              Kindly reach out to your admin to reset your password
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 md:py-5 bg-base bg-gradient-to-r from-base to-[#fff3be] hover:from-[#fff3be] hover:to-base rounded-[12px] text-[1.125rem] text-black font-semibold flex gap-2 items-center justify-center disabled:opacity-70"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginDetails;

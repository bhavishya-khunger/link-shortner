import { useEffect, useState } from "react";
import Error from "./Error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file && !file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profile_pic: "Only image files are allowed.",
        }));
        return;
      }

      if (file && file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profile_pic: "Image must be under 2MB.",
        }));
        return;
      }

      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    return () => {
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={'text-center text-xl'}>Signup</CardTitle>
        <CardDescription className={'text-center'}>
          Create a new account if you haven&rsquo;t already
        </CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>

        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>

        {/* File Upload Section */}
        <div className="space-y-2">
          <label
            htmlFor="profile_pic"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture
          </label>

          <div className="flex items-center gap-4">
            {formData.profile_pic ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                ?
              </div>
            )}

            <div>
              <label
                htmlFor="profile_pic"
                className="cursor-pointer px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Upload Photo
              </label>
              <input
                id="profile_pic"
                name="profile_pic"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              {formData.profile_pic && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.profile_pic.name}
                </p>
              )}
            </div>
          </div>
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup} className="w-full">
          {loading ? (
            <BeatLoader size={10} color="#fff" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;

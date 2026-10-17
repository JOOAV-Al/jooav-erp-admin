"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MailIcon,
  Phone,
  ShieldUser,
  TypeOutline,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react";
import { DialogFormProps } from "@/interfaces/general";
import { UserItem } from "@/features/users/types";
import { useEffect, useState } from "react";
import { Select } from "@/components/general/Select";
import FieldIcon from "@/components/general/FieldIcon";
import { ROLES } from "@/lib/rbac/roles";
import {
  isValidPhoneNumber,
  // parsePhoneNumberFromString,
} from "libphonenumber-js";
import CopyLinkBox from "@/components/general/CopyLinkBox";
import Image from "next/image";
import {
  useRegenerateResetToken,
  useUpdateProfile,
} from "@/features/users/services/users.api";
import { normalizePhone } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/services/auth.api";
import InitialsAvatar from "@/features/users/components/InitialsAvatar";
import { RootState } from "@/redux/store";
import { DoorOpen, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Root } from "react-dom/client";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logout, updateUserData } from "@/redux/slices/authSlice";
import {
  getLoginRoute,
  getStoredRole,
} from "@/features/auth/services/helpers";
import { Spinner } from "@/components/ui/spinner";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(2, "Username is required").max(30, "Username is too long"),
  email: z.email("Email is required"),
  // phone: z.string().min(10, "Phone is required"),
  phone: z.string().refine((val) => {
    return isValidPhoneNumber(val, {
      defaultCountry: "NG",
      defaultCallingCode: "+234",
    });
  }, "Invalid Phone Number"),
  // role: z.string().min(1, "user role is required"),
});

const UserProfileUpdate = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const username = (user?.firstName ?? "") + " " + (user?.lastName ?? "");

  const { mutateAsync: logoutUser } = useLogout();
  const { mutateAsync: updateProfile, isPending: updating } = useUpdateProfile();
  const dispatch = useDispatch();
  const router = useRouter();

  type UserData = z.infer<typeof createUserSchema>;
  const form = useForm<UserData>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      username: user?.username ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields, errors },
    reset,
    setValue,
    getValues,
    setError,
  } = form;

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await logoutUser();
    } finally {
      Cookies.remove("refreshToken");
      Cookies.remove("authToken");
      router.replace(getLoginRoute(getStoredRole()));
    }
  };

  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    console.log("running")
    if (user?.id) {
      // Build partial payload using dirty fields
      const changes: Partial<UserData> = {};
      for (const key of Object.keys(dirtyFields) as Array<keyof UserData>) {
        const val = values[key];
        if (val !== undefined) {
          changes[key] = val;
        }
      }
      if (Object.keys(changes).length === 0) {
        // No changes made, exit edit mode
        setIsEditing(false);
        // reset()
        return;
      }
      const payload = Object.keys(changes).length ? changes : values;
      const res = await updateProfile({ payload });
      dispatch(updateUserData({ user: res.data.data}));
      setIsEditing(false);
      // reset()
      return;
    }
  };

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      username: user?.username ?? "",
    });
  }, [user, reset]);

  return (
    <div className="p-xl">
      {!isEditing ? (
        <div className="flex flex-col gap-sm">
          <div className="flex flex-col gap-main">
            <div className="flex justify-between items-center gap-x-main flex-wrap">
              <div className="py-sm gap-2">
                <h4>Update Profile</h4>
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                size={"neutral"}
                variant={"filter"}
                className={`text-secondary-foreground text-[15px] tracking-[0.02em] leading-[1]`}
              >
                <Edit3 strokeWidth={2} className="w-4.25 h-4.25 text-outline" />
                Edit Profile
              </Button>
            </div>
            <div>
              <InitialsAvatar
                name={username}
                className="w-[48px] h-[48px] bg-brand-secondary! text-brand-accent-2! border-[1.85px] text-2xl!"
              />
            </div>
            <div className="py-sm flex flex-col gap-5">
              <h5>{username}</h5>
              <p className="font-medium text-sm leading-[1.5] tracking-[0.04em] text-body-passive">
                {user?.email}
              </p>
            </div>
            <div className="flex flex-col gap-5 font-medium text-sm leading-[1.5] tracking-[0.04em]">
              <p className="text-body">Username</p>
              <p className="text-body-passive">{user?.username ?? "-"}</p>
            </div>
            <div className="flex flex-col gap-5 font-medium text-sm leading-[1.5] tracking-[0.04em]">
              <p className="text-body">Whatsapp number</p>
              <p className="text-body-passive">{user?.phone}</p>
            </div>
          </div>

          <div className="pt-sm">
            <Button
              onClick={handleLogout}
              size={"default"}
              variant={"filter"}
              className={`text-secondary-foreground text-[15px] tracking-[0.02em] leading-[1] w-full`}
            >
              <DoorOpen strokeWidth={2} className="w-4 h-4 text-outline" />
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <div className="flex flex-col gap-main">
            <div className="flex justify-between items-center">
              <div className="py-sm gap-2">
                <h4>Update Profile</h4>
              </div>
              {/* <Button
                onClick={() => setIsEditing(false)}
                size={"neutral"}
                variant={"filter"}
                className={`text-secondary-foreground text-[15px] tracking-[0.02em] leading-[1]`}
              >
                <Edit3 strokeWidth={2} className="w-4.25 h-4.25 text-outline" />
                View Profile
              </Button> */}
            </div>
            {/* FORM */}
            <form
              id="user-form"
              // onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1"
            >
              <FieldSet className="flex flex-1">
                <FieldGroup className="flex flex-col gap-main">
                  <div className="flex items-center justify-between gap-main">
                    {/* FIRST NAME */}
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field, fieldState }) => (
                        <div>
                          <Field data-invalid={fieldState.invalid}>
                            <div className="flex gap-3 items-center">
                              <FieldLabel>First name</FieldLabel>
                              {fieldState.error && (
                                <FieldError>
                                  : {fieldState.error.message}
                                </FieldError>
                              )}
                            </div>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter first name"
                              aria-invalid={fieldState.invalid}
                              leftIcon={<FieldIcon Icon={UserRoundPen} />}
                              isEdit={!!user}
                            />
                          </Field>
                        </div>
                      )}
                    />

                    {/* LAST NAME */}
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field, fieldState }) => (
                        <div>
                          <Field data-invalid={fieldState.invalid}>
                            <div className="flex gap-3 items-center">
                              <FieldLabel>Last name</FieldLabel>
                              {fieldState.error && (
                                <FieldError>
                                  : {fieldState.error.message}
                                </FieldError>
                              )}
                            </div>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter last name"
                              aria-invalid={fieldState.invalid}
                              leftIcon={<FieldIcon Icon={UserRoundPlus} />}
                              isEdit={!!user}
                            />
                          </Field>
                        </div>
                      )}
                    />
                  </div>

                  {/* EMAIL */}
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <div>
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex gap-3 items-center">
                            <FieldLabel className="text-body-passive">
                              Email
                            </FieldLabel>
                            {fieldState.error && (
                              <FieldError>
                                : {fieldState.error.message}
                              </FieldError>
                            )}
                          </div>
                          <Input
                            {...field}
                            disabled
                            type="email"
                            placeholder="Enter email"
                            aria-invalid={fieldState.invalid}
                            leftIcon={<FieldIcon Icon={MailIcon} />}
                          />
                        </Field>
                      </div>
                    )}
                  />

                  {/* USER NAME */}
                  <Controller
                    control={control}
                    name="username"
                    render={({ field, fieldState }) => (
                      <div>
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex gap-3 items-center">
                            <FieldLabel>Username</FieldLabel>
                            {fieldState.error && (
                              <FieldError>
                                : {fieldState.error.message}
                              </FieldError>
                            )}
                          </div>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter username"
                            aria-invalid={fieldState.invalid}
                            leftIcon={<FieldIcon Icon={TypeOutline} />}
                            isEdit={!!user}
                          />
                        </Field>
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <div>
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex gap-3 items-center">
                            <FieldLabel>WhatsApp number</FieldLabel>
                            {fieldState.error && (
                              <FieldError>
                                : {fieldState.error.message}
                              </FieldError>
                            )}
                          </div>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter WhatsApp number"
                            aria-invalid={fieldState.invalid}
                            // leftIcon={<FieldIcon Icon={Phone} />}
                            leftIcon={
                              <Image
                                src={"/dashboard/whatsApp.svg"}
                                width={20}
                                height={20}
                                alt="Whatsapp"
                              />
                            }
                            isEdit={!!user}
                          />
                        </Field>
                      </div>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={updating}
            // size={"default"}
            // variant={"filter"}
            className={`text-[15px] tracking-[0.02em] leading-[1] w-full`}
          >
            {updating && <Spinner color="white" />}
            {updating ? "Updating..." : "Update profile"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfileUpdate;

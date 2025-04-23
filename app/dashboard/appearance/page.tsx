"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserIcon, Camera, ImageIcon } from "lucide-react";
import { ProfileThemeSelector } from "@/components/dashboard/profile-theme-selector";
import { UploadImageDialog } from "@/components/dashboard/upload-image-dialog";
import { UploadBackgroundDialog } from "@/components/dashboard/upload-background-dialog";
import { AppearanceSkeleton } from "@/components/dashboard/appearance-skeleton";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-z0-9_-]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, underscores, and hyphens",
    }),
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters" })
    .max(50, { message: "Display name cannot exceed 50 characters" }),
  bio: z
    .string()
    .max(160, { message: "Bio cannot exceed 160 characters" })
    .optional()
    .nullable(),
  bookingHtml: z
    .string()
    .max(2000, { message: "Booking HTML cannot exceed 2000 characters" })
    .optional()
    .nullable(),
  theme: z.string(),
});

type Profile = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  bookingHtml: string | null;
  theme: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
};

type Subscription = {
  planType: string;
};

export default function AppearancePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadAvatarDialogOpen, setIsUploadAvatarDialogOpen] =
    useState(false);
  const [isUploadBackgroundDialogOpen, setIsUploadBackgroundDialogOpen] =
    useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameCheckTimeout, setUsernameCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      bookingHtml: "",
      theme: "default",
    },
  });

  // Fetch profile and subscription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch("/api/profile");

        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const data = await profileResponse.json();
        setProfile(data.profile);
        setSubscription(data.subscription);

        // Set form default values
        form.reset({
          username: data.profile.username,
          displayName: data.profile.displayName,
          bio: data.profile.bio || "",
          bookingHtml: data.profile.bookingHtml || "",
          theme: data.profile.theme,
        });
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [form]);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (username === profile?.username) {
      setIsUsernameAvailable(true);
      return;
    }

    try {
      const response = await fetch(
        `/api/profile/check-username?username=${username}`
      );
      const data = await response.json();
      setIsUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("username", value);

    // Clear previous timeout
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    // Set a new timeout to check username availability
    const timeout = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);

    setUsernameCheckTimeout(timeout);
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isUsernameAvailable && values.username !== profile?.username) {
      toast.error("Username is already taken");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();

      // Update local profile state
      setProfile({
        ...profile!,
        ...values,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleImageUploadComplete = (url: string) => {
    setProfile((profile) => (profile ? { ...profile, avatarUrl: url } : null));
  };

  const handleBackgroundUploadComplete = (url: string) => {
    setProfile((profile) =>
      profile ? { ...profile, backgroundUrl: url } : null
    );
  };

  if (isLoading) {
    return <AppearanceSkeleton />;
  }

  const hasPremiumAccess = ["premium", "pro"].includes(
    subscription?.planType || ""
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Profile Appearance</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="profile">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update your profile details and public information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          {profile?.avatarUrl ? (
                            <AvatarImage
                              src={profile.avatarUrl}
                              alt={profile.displayName}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              <UserIcon className="h-12 w-12 text-primary" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full"
                          onClick={() => setIsUploadAvatarDialogOpen(true)}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                        {profile?.backgroundUrl ? (
                          <img
                            src={profile.backgroundUrl}
                            alt="Background"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-2 right-2"
                          onClick={() => setIsUploadBackgroundDialogOpen(true)}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Profile Background Image
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                onChange={onUsernameChange}
                                placeholder="yourname"
                              />
                              {!isUsernameAvailable &&
                                field.value !== profile?.username && (
                                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
                                    Username taken
                                  </div>
                                )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your public username: linkfolio.com/u/{field.value}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your Name" />
                          </FormControl>
                          <FormDescription>
                            Your name as shown on your public profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell visitors a bit about yourself"
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description for your profile (max 160
                            characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      This is how your profile will appear to visitors.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="flex flex-col items-center text-center border rounded-lg p-6 bg-background relative overflow-hidden"
                      style={{
                        backgroundImage: profile?.backgroundUrl
                          ? `url(${profile.backgroundUrl})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {profile?.backgroundUrl && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                      )}
                      <div className="relative z-10">
                        <Avatar className="h-16 w-16">
                          {profile?.avatarUrl ? (
                            <AvatarImage
                              src={profile.avatarUrl}
                              alt={profile.displayName}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              <UserIcon className="h-8 w-8 text-primary" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="mt-4 text-xl font-semibold">
                          {form.watch("displayName") || "Your Name"}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {form.watch("bio") || "Your bio will appear here"}
                        </p>
                        <div className="w-full mt-4 space-y-2">
                          <div className="w-full py-2 px-4 bg-primary/10 rounded-md text-sm text-center">
                            Example Link 1
                          </div>
                          <div className="w-full py-2 px-4 bg-primary/10 rounded-md text-sm text-center">
                            Example Link 2
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Choose a theme for your profile page.
                    {!hasPremiumAccess && (
                      <span className="block mt-1 text-sm text-muted-foreground">
                        Upgrade to premium or pro to unlock all themes
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProfileThemeSelector
                            value={field.value}
                            onChange={field.onChange}
                            isPremium={hasPremiumAccess}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Block</CardTitle>
                  <CardDescription>
                    Add a booking widget to your profile. This will appear above
                    your links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="bookingHtml"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking HTML</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Paste your booking widget HTML code here"
                            className="font-mono text-sm"
                            rows={8}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Paste embed code from Calendly, Tidycal, or other
                          booking services. Leave empty to hide this section.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>

      <UploadImageDialog
        open={isUploadAvatarDialogOpen}
        onOpenChange={setIsUploadAvatarDialogOpen}
        onUploadComplete={handleImageUploadComplete}
      />

      <UploadBackgroundDialog
        open={isUploadBackgroundDialogOpen}
        onOpenChange={setIsUploadBackgroundDialogOpen}
        onUploadComplete={handleBackgroundUploadComplete}
      />
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  displayName: string;
  bio?: string | null;
  theme: string;
}

export function ProfileHeader({
  avatarUrl,
  displayName,
  bio,
  theme,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 shadow-md">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-primary/10">
            <UserIcon className="h-12 w-12 text-primary" />
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className="mt-4 text-2xl font-bold">{displayName}</h1>
      {bio && <p className="mt-2 text-muted-foreground max-w-md">{bio}</p>}
    </div>
  );
}
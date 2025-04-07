
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Pencil } from "lucide-react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import UserEditDialog from "./UserEditDialog";

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="bg-dashboard-blue-dark border-white/10 text-white h-full relative">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <UserIcon className="text-dashboard-accent" />
          User Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="absolute top-6 right-6">
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 w-9 h-9"
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-dashboard-blue-light flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-white/70" />
              )}
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-white/60">{user.email}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Role</p>
                <p className="font-medium text-white bg-white/10 inline-block px-3 py-1 rounded-full">
                  {user.role}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Status</p>
                <p className={`font-medium inline-block px-3 py-1 rounded-full ${
                  user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' :
                  user.status === 'Inactive' ? 'bg-slate-500/20 text-slate-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  {user.status}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-white/60 text-sm mb-1">User ID</p>
              <p className="font-mono bg-white/5 px-3 py-1 rounded text-sm">{user.id}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <UserEditDialog 
        user={user}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </Card>
  );
};

export default UserProfileCard;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState<{
        id: string;
        full_name: string | null;
        nik: string;
        whatsapp_number: string | null;
        email?: string;
    } | null>(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    navigate("/auth");
                    return;
                }

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                    toast.error("Failed to load profile");
                    return;
                }

                setProfile({
                    ...data,
                    email: user.email,
                });
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setUpdating(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    nik: profile.nik,
                    whatsapp_number: profile.whatsapp_number,
                })
                .eq("id", profile.id);

            if (error) {
                if (error.code === "23505") {
                    toast.error("NIK already taken by another user");
                } else {
                    toast.error("Failed to update profile");
                }
                console.error("Update error:", error);
                return;
            }

            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <TopNav />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNav />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">User Profile</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={profile?.email || ""}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={profile?.full_name || ""}
                                onChange={(e) => setProfile(prev => prev ? ({ ...prev, full_name: e.target.value }) : null)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                                id="nik"
                                value={profile?.nik || ""}
                                onChange={(e) => setProfile(prev => prev ? ({ ...prev, nik: e.target.value }) : null)}
                                placeholder="Enter your NIK"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input
                                id="whatsapp"
                                value={profile?.whatsapp_number || ""}
                                onChange={(e) => setProfile(prev => prev ? ({ ...prev, whatsapp_number: e.target.value }) : null)}
                                placeholder="e.g. +628123456789"
                                type="tel"
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={updating}>
                                {updating ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

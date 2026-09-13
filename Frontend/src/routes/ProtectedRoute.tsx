import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../service/authService";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
    allowedRoles: Role[];
    children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

    useEffect(() => {
        let mounted = true;
        getMe()
            .then((me) => {
                if (!mounted) return;
                setStatus(allowedRoles.includes(me.role) ? "ok" : "denied");
            })
            .catch(() => {
                if (mounted) setStatus("denied");
            });
        return () => {
            mounted = false;
        };
    }, [allowedRoles]);

    if (status === "loading") return <div>Loading...</div>; // ganti sesuai loading state komponenmu
    if (status === "denied") return <Navigate to="/login" replace />;
    return <>{children}</>;
}
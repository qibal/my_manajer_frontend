import { Check, CheckCheck } from "lucide-react";
import React from "react";

const ReadReceipt = ({ status }) => {
    if (status === 'read') return <CheckCheck className="w-4 h-4 text-blue-500" />;
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
    if (status === 'sent') return <Check className="w-4 h-4 text-muted-foreground" />;
    return null;
};

export default ReadReceipt; 
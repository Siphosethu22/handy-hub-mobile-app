
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, CheckCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  if (!user || !user.isProvider) {
    navigate("/login");
    return null;
  }

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "monthly",
      features: [
        "Up to 10 job requests/month",
        "Basic profile visibility",
        "Customer messaging",
        "Manual availability toggle"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "$24.99",
      period: "monthly",
      features: [
        "Unlimited job requests",
        "Featured provider listing",
        "Customer messaging",
        "Priority support",
        "Advanced analytics"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: "$49.99",
      period: "monthly",
      features: [
        "Everything in Premium",
        "Top listing position",
        "Verified badge",
        "Priority customer matching",
        "Custom business page",
        "Marketing tools"
      ]
    }
  ];

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-2 pl-0 hover:bg-primary/20"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Membership Plans</h1>
        <p className="text-sm opacity-90">Choose your subscription</p>
      </div>
      
      {/* Plans */}
      <div className="p-4">
        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedPlan === plan.id ? 'border-primary' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                {selectedPlan === plan.id && (
                  <CheckCircle size={20} className="text-primary" />
                )}
              </div>
              <div className="flex items-baseline mb-3">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-gray-600 text-sm ml-1">/{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        
        {/* Payment button */}
        <Button 
          className="w-full flex items-center justify-center"
          disabled={!selectedPlan || loading}
          onClick={handlePayment}
        >
          <CreditCard size={18} className="mr-2" />
          {loading ? "Processing..." : "Pay Now"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Your subscription will automatically renew each month.
          You can cancel at any time from your dashboard.
        </p>
      </div>
    </div>
  );
};

export default Payment;

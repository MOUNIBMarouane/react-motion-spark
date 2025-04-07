
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, ChevronLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth/auth-service";
import { UserRegisterRequest } from "@/services/auth/auth-types";

interface SignupFormProps {
  onBackToLogin: () => void;
}

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
}

const SignupForm = ({ onBackToLogin }: SignupFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    switch(currentStep) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required";
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = "Last name is required";
        }
        if (!formData.username.trim()) {
          newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        }
        break;
        
      case 2:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newErrors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        break;
        
      case 3:
        // Secret key is optional
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSignup();
      }
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const registerData: UserRegisterRequest = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      };

      await authService.register(registerData);
      
      setVerificationSent(true);
      toast({
        title: "Registration successful!",
        description: "Please check your email for the verification code.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "There was an error during signup. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        variant: "destructive",
        title: "Verification code required",
        description: "Please enter the verification code from your email",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(formData.email, verificationCode);
      
      if (result) {
        setVerified(true);
        toast({
          title: "Verification successful",
          description: "Your account has been verified. You can now log in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "The verification code is incorrect or has expired.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "There was an error during verification. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onBackToLogin();
  };

  const fadeVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      key="signup"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dashboard-accent">aennaki</h1>
        <div className="flex items-center mt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="mr-2 p-1 rounded-full hover:bg-dashboard-blue-light text-gray-400"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-gray-400">
            {!verificationSent ? "Create your account" : verified ? "All set!" : "Verify your email"}
          </p>
        </div>
      </div>

      {!verificationSent ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? "bg-dashboard-accent text-white" 
                    : currentStep > step 
                    ? "bg-green-500 text-white" 
                    : "bg-dashboard-blue-light text-gray-400"
                }`}>
                  {currentStep > step ? <CheckCircle2 size={16} /> : step}
                </div>
                <span className="text-xs mt-1 text-gray-400">
                  {step === 1 ? "Personal" : step === 2 ? "Account" : "Secret"}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-200">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-200">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-200">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe123"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.username ? "border-red-500" : ""
                    }`}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={`bg-dashboard-blue-light text-white border-dashboard-blue-light ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="secretKey" className="text-sm font-medium text-gray-200">
                    Secret Key (Optional)
                  </label>
                  <Input
                    id="secretKey"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    placeholder="Enter your secret key if you have one"
                    className="bg-dashboard-blue-light text-white border-dashboard-blue-light"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty if you don't have a secret key.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full bg-dashboard-accent hover:bg-dashboard-accent-light"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {currentStep < 3 ? (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </span>
            )}
          </Button>
        </div>
      ) : !verified ? (
        <motion.div
          key="verification"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-dashboard-blue-light rounded-full flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <Mail className="w-10 h-10 text-dashboard-accent" />
              </motion.div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Needed</h2>
            <p className="text-gray-400 mb-6">
              We've sent a verification code to your email at {formData.email}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="verificationCode" className="text-sm font-medium text-gray-200">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="bg-dashboard-blue-light text-white border-dashboard-blue-light text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              type="button"
              onClick={handleVerifyCode}
              className="w-full bg-dashboard-accent hover:bg-dashboard-accent-light"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Verify Email
                </span>
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              <p>
                Didn't receive a code?{" "}
                <button 
                  type="button" 
                  className="text-dashboard-accent hover:underline"
                  onClick={() => toast({
                    title: "Code Resent",
                    description: "A new verification code has been sent to your email",
                  })}
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={50} className="text-green-500" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Welcome, {formData.firstName}!
            </h2>
            <p className="text-gray-400 mb-8">
              Your account has been created successfully
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              type="button"
              onClick={handleFinish}
              className="w-full bg-dashboard-accent hover:bg-dashboard-accent-light"
            >
              Go to Login
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SignupForm;

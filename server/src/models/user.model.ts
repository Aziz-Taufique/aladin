import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface EnrolledCourse {
    course: mongoose.Types.ObjectId;
    enrolledAt: Date;
}

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "student" | "instructor" | "admin";
    bio?: string;
    enrolledCourses: EnrolledCourse[];
    otp: string,
    createdCourses: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    lastActive: Date;
    passwordComparison(password: string): Promise<boolean>;
    getResetPasswordToken(): string;
    updateLastActive(): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [20, "Name cannot exceed 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
        maxLength: [20, "Password cannot exceed 20 characters"],
        select: false,
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
    bio: {
        type: String,
        maxLength: [300, "Bio cannot exceed 300 characters"],
    },
    enrolledCourses: [
        {
            course: {
                 type: Schema.Types.ObjectId,
                ref: "Coursemodel" },
            enrolledAt: { type: Date, default: Date.now },
        },
    ],
    createdCourses: [
        {
         type: Schema.Types.ObjectId,
         ref: "Coursemodel"
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.passwordComparison = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function (): string {
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
    this.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return resetPasswordToken;
};

userSchema.methods.updateLastActive = function (): Promise<IUser> {
    this.lastActive = new Date();
    return this.save({ validateBeforeSave: true });
};

userSchema.virtual("totalEnrolledCourses").get(function (this: IUser) {
    return this.enrolledCourses?.length || 0;
});

const UserModel: Model<IUser> = mongoose.model<IUser>("Usermodel", userSchema);

export default UserModel;

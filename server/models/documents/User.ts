import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcryptjs';
const SALT_WORK_FACTOR = 14;
const MAX_LOGIN_ATTEMPTS = 5;
import { User } from '../interfaces';
import mongooseLeanDefaults from 'mongoose-lean-defaults';
import mongooseLeanGetters from 'mongoose-lean-getters';

export class UserModel extends Model {
  get id(): string {
    return this._id;
  }
  get name(): string {
    if (!this.firstname && !this.lastname) {
      return this.email;
    }
    return `${this.firstname} ${this.lastname}`;
  }

  isLocked(): boolean {
    // check for a future lockUntil timestamp
    return this.lockUntil && this.lockUntil.getTime() > Date.now();
  }
  async comparePassword(candidatePassword: string): Promise<boolean> {
    if (candidatePassword == null || this.password == null) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
  }

  async incLoginAttempts(): Promise<void> {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil.getTime() < Date.now()) {
      return this.update({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      });
    }
    // otherwise we're incrementing
    const updates: {
      $inc: { loginAttempts: number };
      $set?: { lockUntil: number; lastAttemptedSignIn: number };
    } = {
      $inc: { loginAttempts: 1 },
    };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      const now = new Date();
      updates.$set = {
        lastAttemptedSignIn: now.getTime(),
        lockUntil: now.setHours(now.getHours() + 1),
      };
    }
    return this.update(updates);
  }
}

const UserSchema = new Schema<User & Document>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    confirmed: { type: Boolean, default: false },
    password: {
      type: String,
      required: false,
      select: false, // must use .select('+password')
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastSignIn: Date,
    lastAttemptedSignIn: Date,
    role: String,
    firstname: String,
    lastname: String,
    verify: String,
    sessionId: String,
    acceptedUserTOS: {
      type: Boolean,
      required: true,
      default: false,
    },
    tips: {
      projectList: {
        type: Boolean,
        default: false,
      },
      projectOverview: {
        type: Boolean,
        default: false,
      },
      projectNotes: {
        type: Boolean,
        default: false,
      },
      projectTags: {
        type: Boolean,
        default: false,
      },
      projectKeyInsights: {
        type: Boolean,
        default: false,
      },
      projectRecommendations: {
        type: Boolean,
        default: false,
      },
      projectReports: {
        type: Boolean,
        default: false,
      },
      allTags: {
        type: Boolean,
        default: false,
      },
      collections: {
        type: Boolean,
        default: false,
      },
      search: {
        type: Boolean,
        default: false,
      },
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    saml: {
      nameId: String,
      sessionIndex: String,
      requestId: String,
    },
  },
  {
    timestamps: true,
  }
)
  .set('toJSON', { virtuals: true })
  .loadClass(UserModel)
  .plugin(mongooseLeanDefaults)
  .plugin(mongooseLeanGetters);

UserSchema.index({ email: 'text' }); // for searching by email

export const UserDB = model<UserModel & Document>('User', UserSchema);

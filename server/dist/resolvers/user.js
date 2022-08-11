"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
let LoginStatus = class LoginStatus {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginStatus.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginStatus.prototype, "message", void 0);
LoginStatus = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginStatus);
let UserResolver = class UserResolver {
    users({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            return em.find(User_1.User, {});
        });
    }
    deleteAllUsers({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield em.find(User_1.User, {});
            res.map((user) => __awaiter(this, void 0, void 0, function* () {
                yield em.nativeDelete(User_1.User, { id: user.id });
            }));
            return res;
        });
    }
    user(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            return em.findOne(User_1.User, { id });
        });
    }
    register(newUserID, newUserPassword, newUserFirstName, newUserLastName, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { userID: newUserID });
            if (user != null) {
                return {
                    status: "failed",
                    message: "user already exists",
                };
            }
            const hashedPassword = yield argon2_1.default.hash(newUserPassword);
            const newUser = em.create(User_1.User, {
                userID: newUserID,
                password: hashedPassword,
                firstName: newUserFirstName,
                lastName: newUserLastName
            });
            yield em.persistAndFlush(newUser);
            return {
                status: "successful",
                message: "user created successfully",
            };
        });
    }
    updateUser(userID, newUserID, newUserPassword, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { userID: userID });
            if (!user) {
                return null;
            }
            if (typeof newUserID === "undefined") {
                return user;
            }
            if (typeof newUserPassword === "undefined") {
                return user;
            }
            user.userID = newUserID;
            user.password = yield argon2_1.default.hash(newUserPassword);
            em.persistAndFlush(user);
            return user;
        });
    }
    deleteUser(userID, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { userID: userID });
            if (!user) {
                return false;
            }
            yield em.nativeDelete(User_1.User, { userID: userID });
            return true;
        });
    }
    login(userID, userPassword, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { userID: userID });
            if (!user) {
                return {
                    status: "failed",
                    message: "user does not exist",
                };
            }
            if (!(yield argon2_1.default.verify(user.password, userPassword))) {
                return {
                    status: "failed",
                    message: "password incorrect",
                };
            }
            req.session.userID = userID;
            return {
                status: "successful",
                message: "login successful",
            };
        });
    }
    me({ em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userID) {
                return null;
            }
            const user = yield em.findOne(User_1.User, { userID: req.session.userID });
            return user;
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteAllUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LoginStatus),
    __param(0, (0, type_graphql_1.Arg)("userID")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Arg)("firstName")),
    __param(3, (0, type_graphql_1.Arg)("lastName")),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("userID")),
    __param(1, (0, type_graphql_1.Arg)("newUserID")),
    __param(2, (0, type_graphql_1.Arg)("newUserPassword")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("userID")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => LoginStatus),
    __param(0, (0, type_graphql_1.Arg)("userID")),
    __param(1, (0, type_graphql_1.Arg)("userPassword")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map
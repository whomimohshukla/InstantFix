"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Colorful HTTP logs (method, status, response time)
app.use((0, morgan_1.default)("dev"));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
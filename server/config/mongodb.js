import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
    const uri = process.env.MONGODB_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    const dbName = process.env.MONGODB_DB_NAME || "GenXpress";
    const originalDnsServers = dns.getServers();
    const dnsServers = process.env.MONGODB_DNS_SERVERS
        ? process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
        : ["8.8.8.8", "1.1.1.1"];

    if (uri.startsWith("mongodb+srv://")) {
        dns.setServers(dnsServers);
        console.log(`Using MongoDB DNS servers: ${dnsServers.join(", ")}`);
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message || err);
    });

    try {
        await mongoose.connect(uri, {
            dbName,
            autoIndex: true,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        console.log(`Connected to MongoDB database '${dbName}' using ${uri.startsWith("mongodb+srv://") ? "Atlas" : "local MongoDB"}`);
    } catch (err) {
        if (uri.startsWith("mongodb+srv://") && err.message && err.message.includes("querySrv")) {
            const fallbackDns = process.env.MONGODB_DNS_SERVERS
                ? process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
                : ["8.8.8.8", "1.1.1.1"];

            console.warn("Atlas SRV DNS lookup failed. Retrying with DNS servers:", fallbackDns.join(", "));
            dns.setServers(fallbackDns);
            try {
                await mongoose.connect(uri, {
                    dbName,
                    autoIndex: true,
                    serverSelectionTimeoutMS: 10000,
                    connectTimeoutMS: 10000,
                });
                console.log(`Connected to MongoDB database '${dbName}' after retrying with fallback DNS servers.`);
                return;
            } catch (innerErr) {
                console.error("Retry with fallback DNS servers failed:", innerErr?.message || innerErr);
            }
        }
        throw err;
    } finally {
        if (uri.startsWith("mongodb+srv://")) {
            dns.setServers(originalDnsServers);
        }
    }
};
export default connectDB;
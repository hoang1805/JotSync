import JotformPackage from 'jotform'
import dotenv from 'dotenv';
dotenv.config();

const Jotform = JotformPackage.default;

const API_KEY = process.env.JOTFORM_API_KEY;
console.log("Jotform API Key:", API_KEY);
export default new Jotform(API_KEY);
const ENV = import.meta.env.VITE_ENV;

export default function devLog(file: string, message: string) {
  if (ENV === "dev") {
    console.log(`[${file}] : ${message}`);
  }
}

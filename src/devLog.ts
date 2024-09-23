const ENV = import.meta.env.VITE_ENV;

export default function devLog(file: string, message: string) {
  if (ENV === "dev") {
    const error = new Error(); // 스택 트레이스를 생성
    const stack = error.stack?.split("\n")[2]?.trim(); // 호출 스택의 세 번째 줄을 가져옴
    console.log(`[${file}] : ${message}\n${stack}`);
  }
}

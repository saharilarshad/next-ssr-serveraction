import Link from "next/link";
import postgres from "postgres"
import { Suspense } from "react";
import QuizForm from "./QuizForm";

const sql = postgres(process.env.DATABASE_URL!)

type Quiz = {
  quiz_id: number
  title: string
}

async function Quizzes() {

  // const quizess: Quiz[] = await sql(
  //   // SQL query with cache: 'no-store'
  //   { cache: 'no-store' }
  // )`
  //   SELECT * FROM quizzes
  // `;

  const quizess: Quiz[] = await sql`
  SELECT * FROM quizzes
  `
  // console.log(quizess)
  return (
    <ul className="text-lg text-white font-semibold gap-2">
      {quizess.map((quiz, index) => (
        <li key={quiz.quiz_id} className="flex text-lg text-white font-semibold gap-2">
          {index + 1}.
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <div className="flex items-center justify-center mx-auto h-screen">
      <section className="flex flex-col gap-3 justify-center mx-auto h-[35rem] w-[40rem] bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 p-5 rounded-xl">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center">Quizes</h1>
        {/* <Link href="/quiz/1">Quiz 1</Link>
      <Link href="/quiz/2">Quiz 2</Link>
    <Link href="/quiz/3">Quiz 3</Link> */}
        <div className="flex border-2 border-white rounded-lg p-3 h-56 overflow-y-auto">
          <Suspense fallback={<p>Loading...</p>}>
            <Quizzes />
          </Suspense>
        </div>

        <QuizForm />
      </section>
    </div>
  )
}

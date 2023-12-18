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
    <ul>
      {quizess.map(quiz => (
        <li key={quiz.quiz_id}>
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  return (
    <section className="flex flex-col gap-3">
      <h2>Quizes</h2>
      {/* <Link href="/quiz/1">Quiz 1</Link>
      <Link href="/quiz/2">Quiz 2</Link>
      <Link href="/quiz/3">Quiz 3</Link> */}
      <Suspense fallback={<p>Loading...</p>}>
        <Quizzes />
      </Suspense>

      <QuizForm />
    </section>
  )
}

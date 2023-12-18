import { redirect } from "next/navigation"
import postgres from "postgres"

const sql = postgres(process.env.DATABASE_URL!)

async function Quiz({ quizId, searchParams }: { quizId: string, searchParams: { show?: string } }) {

    // const quiz = await sql`
    // SELECT * FROM quizzes WHERE quiz_id = ${quizId}
    // `
    let answers = await sql`
    SELECT q.quiz_id,
    q.title AS quiz_title,
    q.description AS quiz_description,
    q.question_text AS quiz_question,
    a.answer_id,
    a.answer_text,
    a.is_correct
    FROM quizzes AS q JOIN answers AS a ON q.quiz_id = a.quiz_id
    WHERE q.quiz_id = ${quizId}
    `

    // console.log(quiz)
    console.log(answers)

    return (
        <section>
            {/* <h1>{quiz[0].title}</h1> */}
            <h1>{answers[0].quiz_title}</h1>
            <h2>{answers[0].quiz_question}</h2>
            <ul>

                {answers.map(answer => (
                    <li key={answer.id}>
                        <p>
                            {answer.answer_text}
                            {searchParams.show === "true" && answer.is_correct && '✅'}
                        </p>
                    </li>
                ))}
            </ul>

        </section>
    )
}

export default function QuizPage({ params, searchParams }: { params: { id: string }, searchParams: { show?: string } }) {
    return (
        <section>
            {/* <h2>{params.id}</h2> */}
            <Quiz quizId={params.id} searchParams={searchParams} />
            <form action={async () => {
                'use server'
                redirect(`/quiz/${params.id}?show=true`)
            }}>
                <button type="submit">Show Answer</button>
            </form>
        </section>
    )
}
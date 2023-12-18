import { revalidatePath } from "next/cache"
import postgres from "postgres"

const sql = postgres(process.env.DATABASE_URL!)

function Answer({ id }: { id: number }) {
    return (
        <label className="flex flex-row gap-2 text-white items-center">
            Answer {id} :
            <input type="text" name={`answer-${id}`} className="p-1 rounded-sm border bg-transparent text-white" />
            <input type="checkbox" name={`check-${id}`} className="p-1 rounded-sm border bg-transparent text-white" />
        </label>
    )
}


const QuizForm = () => {

    async function createQuiz(formData: FormData) {
        'use server'
        let title = formData.get("title") as string
        let description = formData.get("description") as string
        let question_text = formData.get("question") as string

        let answers = [1, 2, 3, 4].map((id) => {
            return {
                answer_text: formData.get(`answer-${id}`) as string,
                is_correct: formData.get(`check-${id}`) === 'on'
            }
        })

        console.log({ title, description, question_text, answers })

        await sql`
        WITH new_quiz AS (
            INSERT INTO quizzes (title, description, question_text, created_at)
            VALUES (${title}, ${description}, ${question_text}, NOW())
            RETURNING quiz_id
            )
            INSERT INTO answers (quiz_id, answer_text, is_correct)
            VALUES
                ((SELECT quiz_id FROM new_quiz),${answers[0].answer_text},${answers[0].is_correct}),
                ((SELECT quiz_id FROM new_quiz),${answers[1].answer_text},${answers[1].is_correct}),
                ((SELECT quiz_id FROM new_quiz),${answers[2].answer_text},${answers[2].is_correct}),
                ((SELECT quiz_id FROM new_quiz),${answers[3].answer_text},${answers[3].is_correct})
        `

        revalidatePath("/")
    }

    return (
        <form action={createQuiz} className="border-2 border-white p-3 rounded-xl relative overflow-y-auto">
            <div className="flex flex-col gap-2">
                <label className="flex flex-row gap-2 text-white">Title :
                    <input type="text" name="title" className="p-1 rounded-sm border bg-transparent text-white" />
                </label>
                <label className="flex flex-row gap-2 text-white">Description :
                    <input type="text" name="description" className="p-1 rounded-sm border bg-transparent text-white" />
                </label>
                <label className="flex flex-row gap-2 text-white">Question :
                    <input type="text" name="question" className="p-1 rounded-sm border bg-transparent text-white" />
                </label>
            </div>

            <div className="mt-5 flex flex-col gap-1 mb-5">
                <Answer id={1} />
                <Answer id={2} />
                <Answer id={3} />
                <Answer id={4} />
            </div>

            <div className="flex flex-row w-full justify-end">
                <button type="submit" className="bg-blue-950 p-2 border rounded-full text-white">Create Quize</button>
            </div>

        </form>
    )
}

export default QuizForm
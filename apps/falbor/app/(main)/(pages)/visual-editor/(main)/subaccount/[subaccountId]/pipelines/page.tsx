import { db } from '~/lib/visual-editor/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: { subaccountId: string }
}

const Pipelines = async ({ params }: Props) => {
  const pipelineExists = await db.query.vePipelines.findFirst({
    where: (table, { eq }) => eq(table.subAccountId, params.subaccountId),
  })

  if (pipelineExists)
    return redirect(
      `/visual-editor/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`
    )

  try {
    const response = await db.query.vePipelines.create({
      data: { name: 'First Pipeline', subAccountId: params.subaccountId },
    })

    return redirect(
      `/visual-editor/subaccount/${params.subaccountId}/pipelines/${response.id}`
    )
  } catch (error) {
    console.log()
  }
}

export default Pipelines

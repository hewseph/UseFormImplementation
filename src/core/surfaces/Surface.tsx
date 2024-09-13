import { Paper } from '@mui/material'
import React from 'react'

export default function Surface({
    children,
    center
}: {
    center?: boolean
    children: React.ReactNode
}) {
    return (
        <Paper sx={{
            width: "100%",
            padding: "24px 16px",
            boxSizing: "border-box",
            ...(center && {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            })
        }}>
            {children}
        </Paper>
    )
}

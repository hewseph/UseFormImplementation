import { Box } from '@mui/material'
import React from 'react'

export default function InputSection({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ minWidth: "406px", maxWidth: "450px" }}>
            {children}
        </Box>
    )
}

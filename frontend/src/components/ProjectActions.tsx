import React, { useState, useRef } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import '../styles/projects.css';

const ProjectActions: React.FC = () => {
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [projectCode, setProjectCode] = useState(['', '', '', '', '', '']);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const handleCreateProject = () => {
        // To be implemented later
    };

    const handleJoinProject = () => {
        // To be implemented later
        setIsJoinDialogOpen(false);
        setProjectCode(['', '', '', '', '', '']);
    };

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newProjectCode = [...projectCode];
        newProjectCode[index] = value;
        setProjectCode(newProjectCode);

        if (value !== '' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace' && projectCode[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button 
                variant="contained" 
                color="primary"
                onClick={handleCreateProject}
            >
                Create Project
            </Button>
            <Button 
                variant="outlined" 
                color="primary"
                onClick={() => setIsJoinDialogOpen(true)}
            >
                Join Project
            </Button>

            <Dialog 
                open={isJoinDialogOpen} 
                onClose={() => setIsJoinDialogOpen(false)}
                PaperProps={{ style: { borderRadius: '12px' } }}
            >
                <DialogTitle className="dialog-title">Join Project</DialogTitle>
                <DialogContent className="dialog-content">
                    <div className="project-code-inputs">
                        {projectCode.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={inputRefs[index]}
                                className="project-code-input"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                inputProps={{
                                    maxLength: 1,
                                    style: { textAlign: 'center' }
                                }}
                                variant="outlined"
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button 
                        onClick={() => setIsJoinDialogOpen(false)}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleJoinProject}
                        variant="contained"
                        disabled={projectCode.some(digit => digit === '')}
                    >
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectActions; 
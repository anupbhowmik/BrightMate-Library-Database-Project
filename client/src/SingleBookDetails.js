import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {transferData} from "./App";

import BookIcon from '@mui/icons-material/Book';
import {
    Avatar, Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';

const bull = (
    <Box
        component="span"
        sx={{display: 'inline-block', mx: '2px', transform: 'scale(0.8)'}}
    >
        •
    </Box>
);

export default function SingleBookDetails() {
    return (
        <Grid container spacing={4} padding={10}>
            <Grid item xs={12} md={12}>
                <center>
                    <Avatar sx={{bgcolor: "#E91E63"}}>
                        <BookIcon/>
                    </Avatar>
                </center>
            </Grid>
            <Grid item xs={0} md={2}>
            </Grid>
            <Grid item xs={12} md={8}>
                <div align="left" style={{display: "flex", justifyContent: "center"}}>

                    <Card sx={{minWidth: 800}}>
                        <CardContent>

                            <b><strong><Typography fontFamily="montserrat" variant="h4" component="div">
                                {transferData.Title}
                            </Typography> </strong></b>
                            <br/>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                Edition: {transferData.Edition}
                            </Typography>
                            <Typography sx={{mb: 1.5}} color="text.primary">
                                ISBN: {transferData.ISBN}
                            </Typography>

                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CreateIcon/>
                            </Avatar>
                            <List>
                                {transferData.Author.map((book) => (
                                    <ListItem divider={false}>
                                        <ListItemText
                                            key={transferData.Author}
                                            primary={transferData.Author}
                                        />
                                    </ListItem>
                                ))}

                            </List>


                            <Avatar sx={{bgcolor: "#3A7CFF"}}>
                                <LocalPrintshopIcon/>
                            </Avatar>

                            <Typography paddingTop={1}  variant="body2">
                                {transferData.Publisher}
                            </Typography>

                            <br/>
                            <Avatar  sx={{bgcolor: "#50CB88"}}>
                                <CheckCircleIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                                Available Copies: {transferData.CountOfBooks}
                            </Typography>

                            <br/>
                            <Avatar  sx={{bgcolor: "#E91E63"}}>
                                <LanguageIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                                Language: {transferData.Language}
                            </Typography>

                            <br/>
                            <Avatar  sx={{bgcolor: "#6C63FF"}}>
                                <DescriptionIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                              {transferData.Description}
                            </Typography>


                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </div>
            </Grid>

            <Grid item xs={0} md={2}>
            </Grid>
        </Grid>
    );
}

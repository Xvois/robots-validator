# Robots.txt validator
A simple front end to validate robots files against preexisting best practices for a number of platforms.

## Platform example files.
Example files for each platform are under their own name in the `public` folder. 
Edit their contents on the main branch for updates to automatically apply on the frontend.

### Editing an existing platform.
Example files use a simple system whereby capture groups are annotated by comments at their very beginning.
Comments always abide by this format:

`# TYPE | Comment`

Any content beneath a comment until the next one will be associated with it.

Content beneath comments are usually direct match conditions, so for the condition to be satisfied
there must be an identical match in the target robots.txt file.

Regex patterns **are supported** and must be enclosed by backticks. Each regex condition must have its own comment.

Supported types include: 
- NECESSARY: For conditions that **must** be met. If they are not then a warning will show.
- INFO: To provide neutral information on a statement.
- WARNING: To inform about an issue that may impact the user.
- ERROR: A critical mistake of the highest priority. 

NECESSARY and INFO types should **only** be put in the good practice file.

WARNING and ERROR types should **only** be put in the bad practice file.

### Adding a platform.

To add a platform first add a folder to the `public` folder and add the appropriate txt files.

Next head to `src/Pages/Home.tsx` and modify the `platforms` constant to include the platform name
you just added. This is **case sensitive** so ensure it is typed correctly.


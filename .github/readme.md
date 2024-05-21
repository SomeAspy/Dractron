# Dractron

Electron app for iDRAC's virtual console.

Only works for iDrac 8+, as these versions support HTML5 based KVMs

Untested on iDrac 9. I do not have access to an iDrac 9 machine.

At current stage of development, you must have a file named `indevconfig.json` at the head of the project.

```json
{
    "user": "root",
    "pass": "ServerPasswordHere"
}
```

Commands:

- `pnpm build`: build the project
- `pnpm run`: run the built project (expects `build` to have been run)
- `pnpm dev`: build and run the project

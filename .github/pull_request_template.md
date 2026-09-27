## Plugin

- id: `…`
- version: `…`

## Checklist

- [ ] The id starts with my GitHub user name (`username.plugin-name`) and the folder is `plugins/<id>/`
- [ ] `node scripts/registry.mjs check` passes
- [ ] `displayName` and `description` have both `vi` and `en`
- [ ] `license` is set and every file may be redistributed under it
- [ ] Only the permissions the plugin really needs
- [ ] No minified / obfuscated code
- [ ] Tested on SubT (Plugin Manager → Install from Folder)

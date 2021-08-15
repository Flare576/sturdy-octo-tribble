# talent
Tags, Talent, and Another T Word I'll Come Up With Later

## Project setup
```
docker compose up -d
```

[The UI](http://localhost:8080)
[The API](http://localhost:3080)

## What, that's it?

Yup. Make changes to /api to update the API, and changes to /ui for... yes, the UI

### Lints and fixes files

Not tested yet (8/15/2021), but running this inside either the `ui` container or the local `ui`
folder should work
```
npm run lint
```

# Journal
Got my coffee, got another few hours of quiet, and an idea. Let's see what comes of it.

Firstly, the idea:

A tool that:
- Integrates with Bamboo for user data
- Allows talent and APL's to see a universal set of "tags"
  - Tags can be skills, categories, interests, etc.
  - Tags can have relationships to other tags, such as "is a", "is like", or others
  - With these relationships, along with talent that ALSO acts as a link between tags, tool can
    recommend investigation into other tags. (Talent who relate to "react" also relate to
    "javascript")
  - Provide circular mapping chart, inner circle as "My tags", next layer is "directly related
    tags", then outer layer is tangentally related tags
  - UNDECIDED: I've had the idea that APLs may want to apply tags to a Talent that would help talent
    assignement but that the talent wouldn't agree with or appreciate ("shy", "opinionated",
"smarter than they think", etc.). Having a section that only the APL/PL could see would violate my
goal to provide talent full control, but there's real value there... Not off the table yet.
- APL will be able to enter notes from meetings with the talent
- Talent will be able to enter their own career notes
- Talent will be provided as much control as possible. This means:
  - Talent will be able to see all content of their "profile". -- FUTURE JEREMY NOTE: Except the
    APL-assigned tags; these will be used as .... UGH I DON'T LIKE THE FACT THAT IF AN APL FAILS TO
KEEP THESE UP-TO-DATE THAT THEY COULD BE USED TO TAINT A PROFILE. I'm leaving the feature in for now
but also keeping this note
  - Talent will be able to share individual note entries with others as they see fit.
  - APL will be able to see entries for a talent if:
    - They are assigned to the talent AND
    - The note was NOT written by the talent (i.e., an APL, PL, Etc.)
    -  *OR*
    - They have been given explicit access to an entry
  - If a new APL is assigned, the old APL loses access to their own entries.
  - It would be neat to see PaveStep feedback here, too - stretch goal or link
  - This is not a tool for handling "Issues" or "Concerns" or "Federal Offenses"; There will be no
    god-mode access to note entries. 

So, that's it: Talent entry, notes, tags. The relationship between a Talent and a Tag should have
two values assigned: Skill level and Interest. These have been discussed a lot, but their
definitions for this tool are:

Skill: Level 0-5, where 0 is "I've never written a line of the code, painted a line of the
technique, installed the tool, etc." and 5 is "I have or could acquire a master-level certificate
for this topic"
Interest: Level 0-5, where 0 is "If I'm forced to apply this skill for longer than a few hours, I
will quit." and 5 is "This is something I do or use for pleasure and can't believe someone would pay
me to do it, too."

Soooooo, that doesn't actually seem too bad. Going to need a RDB system of some sort... I've heard
the least bad things about Postgres recently, but AWS does have that Aurora thing for MySQL... and
I've used it most recently, so MySql it is for now.

I don't think we're going to need any other persistence (oAuth via google, no redis, small assets
for now... no NoSQL), shouldn't need microservices or anything. Oh, will probably want a combination
of S3 for SPA and Express/Koa for API (tags/notes).
docker-compose.yml
```
mysql
talent
```

DB tables
```
talent
- id
- email
- GoogleId -- I think this is how we tie the oAuth; haven't had to set it up before
- BambooID -- Bamboo also uses Google oAuth, not sure if they have their own thing

tag
- id
- name
- description

note
- id
- talent_id -- who it's about
- content -- encrypted via system SECRET
- author_id  -- who wrote it

note_state -- allows soft delete of notes
- id
- created_at
- status

talent_apl -- I don't think this is tracked in Bamboo or other system, but if it is, scrap this table
- talent_id
- apl_talent_id

link_type
- id
- desc -- react might have "is a <framework>", "is like <angular>", "includes <javascript>"

tag_link
- tag_id
- link_id

talent_tag
- talent_id
- tag_id
- type -- apl/self
- skill_level
- interest_level

Note: this system doesn't include a shared-key solution (yet) to systematically prevent someone with
DB access from seeing notes; I'm considering that post-mvp right now
```

That covers the DB. The tool itself should consist of:

- Welcome page
  - Goal of tool (Define APL, explain problem of talent assignemnt, explain APL switching, explain
    always learning)
  - Login/My Profile - APL will also see "My Talent"
  - On my Profile I can see:
    - My "Tag Cloud" (circle graph described above)
      - Hovering over a tag brings up hover tip with relationships
      - clicking a tag in center circle removes it, clickign any other adds it
        - Adding a new tag will present a modal with the tag name and a slider for both
          experience/interest. Modal will feature a close X as well as "ADD" and "Cancel" buttons
      - Tags with descriptions should show first x characters, then offer a show-more button to
        expand in-place
      - Add New Tag button with name/desc
    - Notes section
      - New Note followed by existing notes divided between Me and My APL(s) with a unified view
        option
      - See Jira for inspiration
  - On the "My Talent" screen, I should see two-colum design where each has "cards" for a talent.
    Each card should feature a faceshot and the most recent APL comment for that talent. Clicking
the card will take you to a modified version of "My Profile"
  - APL Talent View
    - The talent's tag section will be view-only for APL, but beside it will be the APL cloud,
      allowing APL to manage a separate tracking for quick-reference during talent allocation. The
      same adding interface will be used (interest/skill), but targeting the apl type
    - Comments section will include all APL entries but only the Talent notes they've been granted
      access to. UI coloring should indicate whether THEY wrote the APL note or it was written by a
previous APL, as well as something to indicate there are Talent notes to view.

Note: stretch-goal of tracking "viewed notes"


Uh... is that it? did I just define the whole tool in about 2h? neat.

## Get it done.. er... started

Decided to give a "quick start" tool a try via [Vue
CLI](https://cli.vuejs.org/guide/installation.html). Why Vue? Because [I liked what I saw
here](https://www.youtube.com/watch?v=cuHDQhDhvPE). That gave me a file structure I could spin up
and see run, but I know I'm going to need a local mysql, api, and UI system, so I also looked for
[docker compose and
vue](https://medium.com/bb-tutorials-and-thoughts/vue-js-local-development-with-docker-compose-275304534f7c).
This is probably going to be where I start.

So, root folders will be "api" and "ui"... something tells me I should go look around our RobotFood
a bit... but there's a lot there, so I'll get something done, then get it done right.

ok, folders

api
 |-src
 |-Dockerfile
ui
 |-src
 |-Dockerfile
mysql_data
 |-README.md
docker-compose.yml

The `mysql_data` thing is a theory I want to try for allowing a bit more persistance beteween
startup/teardowns; mapped data volume for mysql.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

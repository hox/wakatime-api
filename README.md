# Wakatime API Gist Updater

Featured on my github profile, you can use this project and all you need to fill out is the .env and then you can put the gist on your profile! Thanks for coming by!

# Release

The absolute first step to running this project on your own is downloading the source code, `master` may potentially have bugs so download this project from one of the released versions [here](https://github.com/hox/wakatime-api/releases).

# Setup

1. Create a Personal Access Token with Github [here](https://github.com/settings/tokens/new), you will need the scope `gist`. Once you have your new Personal Access Token set that as an environment variable under `GITHUB_TOKEN`.

2. Create a **Public** Github Gist [here](https://gist.github.com/), once created you will be redirected to a url formatted like `https://gist.github.com/username/{GIST_ID}`. Copy the gist id from the url and set that as an environment variable under `GIST_ID`.

3. Create an account on Wakatime's website [here](https://wakatime.com/signup), or if you already have an account skip this step.

4. Navigate to the `Share > Embed` section of Wakatime's website [here](https://wakatime.com/share/embed), and create an Embeddable Code with the default settings except for the following:

- Format: `JSON`
- Chart Type: `Coding Activity`

5. Under the output you will see a `url: https://wakatime.com/share/@{SHARE_ID}`, copy the share id from the url and set that as an environment vairable under `TIMES_PATH` formatted like `share/@xxxxxxxxxx/xxxxxxxxxx`.

6. Repeat steps 4 & 5 but instead of `Chart Type: Coding Activity` you want `Chart Type: Languages`, and set that as the environment vairable `LANGS_PATH` with the same formatting.

7. Run the command `npm install` to install all of the required dependencies for the updater to run.

8. Start the updater with the command `npm start`.

Congratulations, you are done! Enjoy the gist updater and please consider leaving a ⭐ on this repo if you enjoy. If you have any questions or need help with something please create an Issue or contact me via [twitter](https://go.eli.tf/twitter).

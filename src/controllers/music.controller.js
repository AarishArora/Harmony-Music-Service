import { uploadFile } from "../services/storage.service.js";
import musicModel from "../models/music.model.js"
import playlistModel from "../models/playlist.model.js";



export async function uploadMusic(req, res) {

    const musicFile = req.files[ 'music' ][ 0 ];
    const coverImageFile = req.files[ 'coverImage' ][ 0 ];


    try {

        const musicFileId = await uploadFile(musicFile);
        const coverImageFileId = await uploadFile(coverImageFile);

        const music = await musicModel.create({
            title: req.body.title,
            artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
            artistId: req.user.id,
            musicKey: musicFileId,
            coverImageKey: coverImageFileId
        })

        return res.status(201).json({ message: 'Music uploaded successfully', music });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }


}

export async function getMusicById(req, res) {
    const { id } = req.params;

    try {
        const music = await musicModel.findById(id).lean();

        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        music.musicUrl = music.musicKey;
        music.coverImageUrl = music.coverImageKey;

        return res.status(200).json({ music });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getAllMusics(req, res) {

    const { skip = 0, limit = 10 } = req.query;

    try {
        const musicsDocs = await musicModel.find().skip(skip).limit(limit).lean();

        const musics = []

        for (let music of musicsDocs) {
            music.musicUrl = music.musicKey;
            music.coverImageUrl = music.coverImageKey;
            musics.push(music);
        }

        return res.status(200).json({ message: "Musics fetched successfully", musics });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getArtistMusics(req, res) {
    try {
        const musicsDocs = await musicModel.find({ artistId: req.user.id }).lean();

        const musics = []

        for (let music of musicsDocs) {
            music.musicUrl = music.musicKey;
            music.coverImageUrl = music.coverImageKey;
            musics.push(music);
        }

        return res.status(200).json({ musics });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createPlaylist(req, res) {
    const { title, musics } = req.body;

    try {
        const playlist = await playlistModel.create({
            artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
            artistId: req.user.id,
            title,
            userId: req.user.id,
            musics
        })

        return res.status(201).json({ message: 'Playlist created successfully', playlist });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getPlaylists(req, res) {
    try {
        const playlists = await playlistModel.find({ artistId: req.user.id })
        return res.status(200).json({ playlists });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getPlaylistById(req, res) {
    const { id } = req.params;

    try {
        const playlistDoc = await playlistModel.findById(id).lean();

        if (!playlistDoc) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const musics = []

        for (let musicId of playlistDoc.musics) {
            const music = await musicModel.findById(musicId).lean();
            if (music) {
                music.musicUrl = music.musicKey;
                music.coverImageUrl = music.coverImageKey;
                musics.push(music);
            }
        }

        playlistDoc.musics = musics;

        return res.status(200).json({ playlist: playlistDoc });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getArtistPlaylists(req, res) {
    try {
        const playlists = await playlistModel.find({ artistId: req.user.id })
        return res.status(200).json({ playlists });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updatePlaylist(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    try {
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Playlist title is required' });
        }

        const playlist = await playlistModel.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if user is the owner of the playlist
        if (playlist.artistId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own playlists' });
        }

        playlist.title = title.trim();
        await playlist.save();

        return res.status(200).json({ message: 'Playlist updated successfully', playlist });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deletePlaylist(req, res) {
    const { id } = req.params;

    try {
        const playlist = await playlistModel.findById(id);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if user is the owner of the playlist
        if (playlist.artistId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own playlists' });
        }

        await playlistModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function addMusicToPlaylist(req, res) {
    const { playlistId, musicId } = req.body;

    try {
        if (!playlistId || !musicId) {
            return res.status(400).json({ message: 'Playlist ID and Music ID are required' });
        }

        const playlist = await playlistModel.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if user is the owner of the playlist
        if (playlist.artistId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only add music to your own playlists' });
        }

        // Check if music already exists in playlist
        if (playlist.musics.includes(musicId)) {
            return res.status(400).json({ message: 'Music already exists in this playlist' });
        }

        playlist.musics.push(musicId);
        await playlist.save();

        return res.status(200).json({ message: 'Music added to playlist successfully', playlist });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function searchMusic(req, res) {
    const { query } = req.query;

    try {
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

        const musicsDocs = await musicModel.find({
            $or: [
                { title: searchRegex },
                { artist: searchRegex }
            ]
        }).lean();

        const musics = [];

        for (let music of musicsDocs) {
            music.musicUrl = await getPresignedUrl(music.musicKey);
            music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
            musics.push(music);
        }

        return res.status(200).json({ message: "Search results fetched successfully", musics });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteMusic(req, res) {
    const { id } = req.params;

    try {
        const music = await musicModel.findById(id);

        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        // Check if user is the owner of the music
        if (music.artistId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own music' });
        }

        await musicModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Music deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
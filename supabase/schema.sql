-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS audio_messages CASCADE;
DROP TABLE IF EXISTS fun_facts CASCADE;
DROP TABLE IF EXISTS tributes CASCADE;

-- Create tributes table
CREATE TABLE tributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create memories table
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create fun_facts table
CREATE TABLE fun_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create audio_messages table
CREATE TABLE audio_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER,
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    is_deleted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_memories_updated_at
    BEFORE UPDATE ON memories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fun_facts_updated_at
    BEFORE UPDATE ON fun_facts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_messages_updated_at
    BEFORE UPDATE ON audio_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tributes_updated_at
    BEFORE UPDATE ON tributes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;

-- Create policies for memories
CREATE POLICY "Allow public read access to memories"
    ON memories FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Allow authenticated users to create memories"
    ON memories FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to update their own memories"
    ON memories FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = user_email);

-- Create policies for fun_facts
CREATE POLICY "Allow public read access to fun facts"
    ON fun_facts FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Allow authenticated users to create fun facts"
    ON fun_facts FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to update their own fun facts"
    ON fun_facts FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = user_email);

-- Create policies for audio_messages
CREATE POLICY "Allow public read access to audio messages"
    ON audio_messages FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Allow authenticated users to create audio messages"
    ON audio_messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to update their own audio messages"
    ON audio_messages FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = user_email);

-- Create policies for tributes
CREATE POLICY "Allow public read access to tributes"
    ON tributes FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Allow authenticated users to create tributes"
    ON tributes FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to update their own tributes"
    ON tributes FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = user_email);

-- Insert birthday tribute
INSERT INTO tributes (title, content, created_at, user_email)
VALUES 
    ('A Birthday Tribute',
     E'Hey daddoo, it\'s your son here, talking through the Interweb.www. I hope you are doing well on this fine day, because gosh darn, you deserve to be (doing well (on this fine day)).\n\nI hope that storms and blizzards never come your way. Well, that\'s enough for me, I\'ve got to hit the hay.\n\nJust kidding, let\'s pray:\n\nI pray that my dad has an exceptional year full of exceptional blessings. Amen.\n\nWhat I meant to say, is that I\'m not so good at this. I just write random words and un-oddly enough, I pick the most basic word to rhyme, "day." Not very impressive.\n\nBut today\'s not about me. It\'s about my padre.\n\nYou\'re smart, kind, and the best cook known to man. I\'m sorry I made this idiotic website instead of buying you a frying pan... this isn\'t funny. damn.\n\nThat\'s enough of this. Happy birthday daddoo.\n\nFrom Reagan',
     '2023-12-15T00:00:00Z',
     'reagan@gmail.com');

-- Insert default memories
INSERT INTO memories (title, content, image_url, created_at, user_email)
VALUES 
    ('Memory 1', '', 'https://imgur.com/m9dIxdM.jpg', '2023-12-05T00:00:00Z', 'reagan@gmail.com'),
    ('Memory 2', '', 'https://imgur.com/XWQxuCg.jpg', '2023-12-05T01:00:00Z', 'reagan@gmail.com'),
    ('Memory 3', '', 'https://imgur.com/wUln2kq.jpg', '2023-12-05T02:00:00Z', 'reagan@gmail.com'),
    ('Memory 4', '', 'https://imgur.com/NDEzhu6.jpg', '2023-12-05T03:00:00Z', 'reagan@gmail.com'),
    ('Memory 5', '', 'https://imgur.com/YEqEAbZ.jpg', '2023-12-05T04:00:00Z', 'reagan@gmail.com');

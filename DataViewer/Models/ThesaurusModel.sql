-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[GE_CompositionPart]', 'U') IS NOT NULL
    DROP TABLE [dbo].[GE_CompositionPart];
GO
IF OBJECT_ID(N'[dbo].[GE_GeologicEvent]', 'U') IS NOT NULL
    DROP TABLE [dbo].[GE_GeologicEvent];
GO
IF OBJECT_ID(N'[dbo].[GE_GeologicFeature]', 'U') IS NOT NULL
    DROP TABLE [dbo].[GE_GeologicFeature];
GO
IF OBJECT_ID(N'[dbo].[GE_GeologicUnit]', 'U') IS NOT NULL
    DROP TABLE [dbo].[GE_GeologicUnit];
GO
IF OBJECT_ID(N'[dbo].[THESAURUS_CGI]', 'U') IS NOT NULL
    DROP TABLE [dbo].[THESAURUS_CGI];
GO
IF OBJECT_ID(N'[dbo].[THESAURUS_Concept]', 'U') IS NOT NULL
    DROP TABLE [dbo].[THESAURUS_Concept];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'GE_CompositionPart'
CREATE TABLE [dbo].[GE_CompositionPart] (
    [CP_ID] int  NOT NULL,
    [GU_ID] int  NOT NULL,
    [Lithology] nvarchar(255)  NULL,
    [Protolith] nvarchar(255)  NULL,
    [Proportion] nvarchar(255)  NULL,
    [CompositionPartRole] nvarchar(255)  NULL,
    [Notes] nvarchar(255)  NULL
);
GO

-- Creating table 'GE_GeologicEvent'
CREATE TABLE [dbo].[GE_GeologicEvent] (
    [GE_ID] int  NOT NULL,
    [GF_ID] int  NOT NULL,
    [YoungerAge] nvarchar(255)  NULL,
    [OlderAge] nvarchar(255)  NULL,
    [EventProcess] nvarchar(255)  NULL,
    [EventEnvironment] nvarchar(255)  NULL,
    [Notes] nvarchar(255)  NULL,
    [MainAge] nvarchar(255)  NULL
);
GO

-- Creating table 'GE_GeologicFeature'
CREATE TABLE [dbo].[GE_GeologicFeature] (
    [GF_ID] int  NOT NULL,
    [L_ID] nvarchar(20)  NULL,
    [GeologicCollectionID] int  NULL,
    [GeologicCollectionTitle] nvarchar(255)  NULL,
    [Notes] nvarchar(255)  NULL,
    [LEGTEXT] nvarchar(max)  NULL,
    [DescriptionPurpose] nvarchar(255)  NULL,
    [LEGKURZ] nvarchar(255)  NULL
);
GO

-- Creating table 'GE_GeologicUnit'
CREATE TABLE [dbo].[GE_GeologicUnit] (
    [GU_ID] int  NOT NULL,
    [GF_ID] int  NOT NULL,
    [GeologicUnitType] nvarchar(255)  NULL,
    [GeologicUnitName] nvarchar(255)  NULL,
    [TectonicUnit] nvarchar(255)  NULL,
    [CompoundUnit] bit  NOT NULL,
    [Notes] nvarchar(255)  NULL
);
GO

-- Creating table 'THESAURUS_CGI'
CREATE TABLE [dbo].[THESAURUS_CGI] (
    [URI] nvarchar(255)  NOT NULL,
    [URI_alt] nvarchar(255)  NULL,
    [PrefLabelEn] nvarchar(255)  NULL,
    [DescriptionEn] nvarchar(max)  NULL,
    [ConceptSchemeURI] nvarchar(255)  NULL
);
GO

-- Creating table 'THESAURUS_Concept'
CREATE TABLE [dbo].[THESAURUS_Concept] (
    [URI] nvarchar(255)  NOT NULL,
    [ThesaurusURI] nvarchar(255)  NULL,
    [PrefLabelDe] nvarchar(255)  NULL,
    [PrefLabelEn] nvarchar(255)  NULL,
    [DescriptionDe] nvarchar(max)  NULL,
    [DescriptionEn] nvarchar(max)  NULL,
    [HexColor] nvarchar(20)  NULL,
    [GbaStatus] nvarchar(255)  NULL,
    [PosLong] float  NULL,
    [PosLat] float  NULL,
    [BroaderConceptURI] nvarchar(max)  NULL,
    [BroaderConceptPrefLabelDe] nvarchar(max)  NULL,
    [BroaderConceptPrefLabelEn] nvarchar(max)  NULL,
    [ConceptSchemeURI] nvarchar(255)  NULL,
    [ConceptSchemeTitleDe] nvarchar(255)  NULL,
    [ConceptSchemeTitleEn] nvarchar(255)  NULL,
    [TopConceptURI] nvarchar(255)  NULL,
    [TopConceptPrefLabelDe] nvarchar(255)  NULL,
    [TopConceptPrefLabelEn] nvarchar(255)  NULL,
    [InspireMappingURI] nvarchar(255)  NULL,
    [DBpediaMappingURI] nvarchar(255)  NULL,
    [GeoscimlMappingURI] nvarchar(255)  NULL,
    [BgsMappingURI] nvarchar(255)  NULL,
    [DateCreated] datetime  NULL,
    [DateModified] datetime  NULL,
    [E_USER] varchar(20)  NULL,
    [E_DATUM] datetime  NULL,
    [A_USER] varchar(20)  NULL,
    [A_DATUM] datetime  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [CP_ID] in table 'GE_CompositionPart'
ALTER TABLE [dbo].[GE_CompositionPart]
ADD CONSTRAINT [PK_GE_CompositionPart]
    PRIMARY KEY CLUSTERED ([CP_ID] ASC);
GO

-- Creating primary key on [GE_ID] in table 'GE_GeologicEvent'
ALTER TABLE [dbo].[GE_GeologicEvent]
ADD CONSTRAINT [PK_GE_GeologicEvent]
    PRIMARY KEY CLUSTERED ([GE_ID] ASC);
GO

-- Creating primary key on [GF_ID] in table 'GE_GeologicFeature'
ALTER TABLE [dbo].[GE_GeologicFeature]
ADD CONSTRAINT [PK_GE_GeologicFeature]
    PRIMARY KEY CLUSTERED ([GF_ID] ASC);
GO

-- Creating primary key on [GU_ID] in table 'GE_GeologicUnit'
ALTER TABLE [dbo].[GE_GeologicUnit]
ADD CONSTRAINT [PK_GE_GeologicUnit]
    PRIMARY KEY CLUSTERED ([GU_ID] ASC);
GO

-- Creating primary key on [URI] in table 'THESAURUS_CGI'
ALTER TABLE [dbo].[THESAURUS_CGI]
ADD CONSTRAINT [PK_THESAURUS_CGI]
    PRIMARY KEY CLUSTERED ([URI] ASC);
GO

-- Creating primary key on [URI] in table 'THESAURUS_Concept'
ALTER TABLE [dbo].[THESAURUS_Concept]
ADD CONSTRAINT [PK_THESAURUS_Concept]
    PRIMARY KEY CLUSTERED ([URI] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [GF_ID] in table 'GE_GeologicUnit'
ALTER TABLE [dbo].[GE_GeologicUnit]
ADD CONSTRAINT [FK_GE_GeologicFeatureGE_GeologicUnit]
    FOREIGN KEY ([GF_ID])
    REFERENCES [dbo].[GE_GeologicFeature]
        ([GF_ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GE_GeologicFeatureGE_GeologicUnit'
CREATE INDEX [IX_FK_GE_GeologicFeatureGE_GeologicUnit]
ON [dbo].[GE_GeologicUnit]
    ([GF_ID]);
GO

-- Creating foreign key on [GU_ID] in table 'GE_CompositionPart'
ALTER TABLE [dbo].[GE_CompositionPart]
ADD CONSTRAINT [FK_GE_GeologicUnitGE_CompositionPart]
    FOREIGN KEY ([GU_ID])
    REFERENCES [dbo].[GE_GeologicUnit]
        ([GU_ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GE_GeologicUnitGE_CompositionPart'
CREATE INDEX [IX_FK_GE_GeologicUnitGE_CompositionPart]
ON [dbo].[GE_CompositionPart]
    ([GU_ID]);
GO

-- Creating foreign key on [GF_ID] in table 'GE_GeologicEvent'
ALTER TABLE [dbo].[GE_GeologicEvent]
ADD CONSTRAINT [FK_GE_GeologicFeatureGE_GeologicEvent]
    FOREIGN KEY ([GF_ID])
    REFERENCES [dbo].[GE_GeologicFeature]
        ([GF_ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_GE_GeologicFeatureGE_GeologicEvent'
CREATE INDEX [IX_FK_GE_GeologicFeatureGE_GeologicEvent]
ON [dbo].[GE_GeologicEvent]
    ([GF_ID]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------
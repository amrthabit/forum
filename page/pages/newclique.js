import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useField } from "../comps/useField";
import Button from "../comps/buttonV2";
import { useFormNewCliqueMutation } from "../src/generated/graphql";
import { useState } from "react";
import { useRouter } from "next/router";

function NewClique({ theme, ...props }) {
  const cliqueField = {
    name: useField((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    description: useField(() => false),
    set: (e) => {
      cliqueField[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || cliqueField[e.target.name].error === true) {
        cliqueField[e.target.name].validate(e.target.value);
      }
    },
    reset: () => {
      cliqueField.name.set("");
      cliqueField.description.set("");
      cliqueField.description.setError(false);
    },
    validate: () => {
      return [cliqueField.name.validate(), cliqueField.content.validate()];
    },
  };
  const [, formNewClique] = useFormNewCliqueMutation();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

  const handleCreateNewClique = async () => {
    setLoading(true);
    const response = await formNewClique({
      cliqueID: cliqueField.name.text,
      description: cliqueField.description.text,
    });
    if (response.data?.formNewClique.status !== "successful") {
      setResponseMessage(
        response.data?.formNewClique.message || "Failed. Try again later."
      );
    } else {
      setResponseMessage("Clique created successfully. Redirecting...");
      setTimeout(() => {
        console.log(response);
        router.push(`/clique/${cliqueField.name.text.toLowerCase()}`);
      }, 2000);
    }
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Box sx={{ display: "flex", marginTop: 2 }}>
      <Box
        sx={{
          color: theme.palette.text.primary,
          transition: "all 0.3s",
          mx: "auto",
          width: "100%",
          maxWidth: 740,
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 2,
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          size="small"
          sx={{ width: "100%" }}
          placeholder="Clique name"
          name="name"
          value={cliqueField.name.text}
          error={cliqueField.name.error}
          onChange={cliqueField.set}
          onBlur={cliqueField.set}
          onFocus={cliqueField.set}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          size="small"
          sx={{ width: "100%", marginTop: 1 }}
          placeholder="Clique description"
          name="description"
          value={cliqueField.description.text}
          error={cliqueField.description.error}
          onChange={cliqueField.set}
          onBlur={cliqueField.set}
          onFocus={cliqueField.set}
          inputProps={{ maxLength: 20 }}
        />
        <Box sx={{ display: "flex", marginTop: 1 }}>
          <Box sx={{ fontSize: 20, marginLeft: 1, my: "auto" }}>
            {responseMessage}
          </Box>
          <Button
            loading={loading}
            theme={theme}
            sx={{ marginLeft: "auto", fontSize: 18 }}
            onClick={handleCreateNewClique}
          >
            CREATE NEW CLIQUE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient)(NewClique);
